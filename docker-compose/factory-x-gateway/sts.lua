-- Copyright 2026 Codewerk GmbH
--
-- Licensed under the Apache License, Version 2.0 (the "License");
-- you may not use this file except in compliance with the License.
-- You may obtain a copy of the License at
--
--     http://www.apache.org/licenses/LICENSE-2.0
--
-- Unless required by applicable law or agreed to in writing, software
-- distributed under the License is distributed on an "AS IS" BASIS,
-- WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
-- See the License for the specific language governing permissions and
-- limitations under the License.

local _M = {}

local http  = require("resty.http")
local cjson = require("cjson")

-- Exchanges the incoming bearer token via STS, sets the Authorization header.
-- opts:
--   sts_url        (string, REQUIRED) STS token endpoint
--   target_service (string, REQUIRED) audience / target for the exchange
--   cache_name     (string)  name of the lua_shared_dict (default "sts_token_cache")
--   default_ttl    (number)  fallback TTL when STS omits expires_in (default 300)
function _M.exchange(opts)
  opts = opts or {}

  local sts_url = opts.sts_url
  if not sts_url then
    ngx.log(ngx.ERR, "sts.exchange: sts_url is required")
    ngx.exit(500)
  end

  local target_service = opts.target_service
  if not target_service then
    ngx.log(ngx.ERR, "sts.exchange: target_service is required")
    ngx.exit(500)
  end

  local cache_name  = opts.cache_name  or "sts_token_cache"
  local default_ttl = opts.default_ttl or 300

  local auth = ngx.req.get_headers()["Authorization"]
  if not auth then
    return    -- no Authorization header --> passthrough
  end

  local source_token = string.match(auth, "^[Bb]earer%s+(.+)$")
  if not source_token then return end    -- no Token --> passthrough

  -- cache lookup
  -- Note: the cache lookup key must always include caller identity
  --       (here, via source_token) to prevent leaking between different callers
  local cache = ngx.shared[cache_name]
  local cache_key = target_service .. ":" .. source_token
  local target_token = cache:get(cache_key)

  -- if cache lookup failed, request STS
  if not target_token then
    local httpc = http.new()
    ngx.log(ngx.INFO, "sts.exchange: requesting token from ", sts_url,
      " grant_type=", "urn:ietf:params:oauth:grant-type:token-exchange",
      " subject_token_type=", "urn:ietf:params:oauth:token-type:jwt",
      " audience=", target_service)
    local res, err = httpc:request_uri(sts_url, {
      method  = "POST",
      headers = { ["Content-Type"] = "application/x-www-form-urlencoded" },
      body    = "grant_type="
        .. ngx.escape_uri("urn:ietf:params:oauth:grant-type:token-exchange")
        .. "&subject_token_type="
        .. ngx.escape_uri("urn:ietf:params:oauth:token-type:jwt")
        .. "&subject_token=" .. ngx.escape_uri(source_token)
        .. "&audience="      .. ngx.escape_uri(target_service),
    })


    if not res then
      -- got no response from STS, 502 Bad Gateway
      ngx.status = 502
      ngx.exit(502)
    elseif res.status ~= 200 then
      -- got error response from STS, 401 Unauthorized if 4XX, else 502 Bad Gateway
      local status = (res.status >= 400 and res.status < 500) and 401 or 502
      ngx.status = status
      ngx.exit(status)
    end

    local data = cjson.decode(res.body)
    target_token = data.access_token
    cache:set(cache_key, target_token, tonumber(data.expires_in) or default_ttl)
  end

  ngx.req.set_header("Authorization", "Bearer " .. target_token)
end

return _M
