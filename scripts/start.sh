#!/bin/sh

set -e

SCRIPT_DIR=$(dirname "$0")

echo -e '\033[38;5;22m' # Dark Green
# src: https://patorjk.com/software/taag/#p=display&h=1&v=1&f=Stop&t=Mnestix%20Browser%0A
cat << EOF
           ______                        _         ______                                                
          |  ___ \                  _   (_)       (____  \                                              
 ___ ___  | | _ | |____   ____  ___| |_  _ _   _   ____)  ) ____ ___  _ _ _  ___  ____  ____   ___ ___   
(___|___) | || || |  _ \ / _  )/___)  _)| ( \ / ) |  __  ( / ___) _ \| | | |/___)/ _  )/ ___) (___|___)  
          | || || | | | ( (/ /|___ | |__| |) X (  | |__)  ) |  | |_| | | | |___ ( (/ /| |               
          |_||_||_|_| |_|\____|___/ \___)_(_/ \_) |______/|_|   \___/ \____(___/ \____)_|               
                                                                                    
by XITASO
EOF
echo -e '\033[0m' # Reset to default color

# Deploy database migrations
status_output=$(yarn prisma migrate status --schema=/app/prisma/schema.prisma 2>&1 || true)
if echo "$status_output" | grep -q "Database schema is up to date!"; then
  echo "No pending migrations found."
else
  echo "Pending migrations found, applying them..."
  yarn prisma migrate deploy --schema=/app/prisma/schema.prisma
fi

# Validate envs for production
node "$SCRIPT_DIR/validateEnvs.js"

HOSTNAME=0.0.0.0 PORT=3000 node server.js