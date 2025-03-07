<p align="right">
  <picture>
    <source srcset="src/assets/XitasoLogo.svg"  media="(prefers-color-scheme: dark)">
    <img src="src/assets/XitasoLogoBlack.svg" width=20%>
  </picture>
</p>
<p align="center">
 <img src="public/android-chrome-192x192.png" alt="Mnestix Logo">
</p>
<h1 style="text-align: center">Mnestix</h1>

[![Made by XITASO](https://img.shields.io/badge/Made_by_XITASO-005962?style=flat-square)](https://xitaso.com/)
[![MIT License](https://img.shields.io/badge/License-MIT-005962.svg?style=flat-square)](https://choosealicense.com/licenses/mit/)
[![Yarn License](https://img.shields.io/badge/YARN-V1.22.22-005962?style=flat-square)]()
[![Join our Community](https://img.shields.io/badge/Join_our_Community-005962?style=flat-square)](https://xitaso.com/kompetenzen/mnestix/#support)

### Welcome to the Mnestix Community!

Mnestix Browser is an open source software designed to simplify the implementation of the Asset Administration Shell.
Together
with increasing contributions from users and developers, a growing community is working on further development under the
leadership of XITASO, a leading high-end software development company in the engineering industry.
Mnestix Browser is the perfect tool to demonstrate the power and potential of AAS (**Asset Administration Shells**) for
the
implementation of standardized digital twins. It opens the way for use cases such as the Digital Product Passport (DPP).

You can find a demo [here](https://mnestix-prod.azurewebsites.net/).
Some screenshots can be found in the [screenshots folder](screenshots).

### **If you need support feel free to contact us through our website [here](https://xitaso.com/kompetenzen/mnestix/#support).**

### **Join our Mnestix Community Hour, register [here](https://xitaso.com/event/mnestix-open-hour/).**

## Quickstart

All you need to start your first Mnestix instance is the `compose.yml` (or clone the repository).
In the root directory run the following command and open http://localhost:3000 in your web browser.

```shell
docker compose up
```

### If you want to further configure your mnestix instance, go to our [wiki](https://github.com/eclipse-mnestix/mnestix-browser/wiki).


## Feature Overview

The Mnestix Browser enables you to browse through the different AAS Dataspaces.
It allows you to **visualize Asset Administration Shells and their submodels**. It supports the AAS Metamodel and API in
version 3.

You configure the endpoint of an AAS repository and browse the different AAS, if a Discovery Service is available, it is
also possible to search for AssetIds and visualize the corresponding AAS.

Mnestix AAS Browser is also **optimized for mobile view** to have a **great user experience** on mobile phones.

Mnestix can **visualize every submodel** even if it is not standardized by IDTA. There are some submodels **visualized
in an extra user-friendly manner**. These are:

- Digital Nameplate
- Handover Documentation
- Carbon Footprint
- **and more!**

Moreover, dedicated visualizations for submodels can be added as a further feature.

## Register for our newsletter
<style type="text/css">
@import "https://news.xitaso.com/-google-api-css/Droid+Sans|Droid+Serif|Lato|Open+Sans|Open+Sans+Condensed:300|PT+Serif|Raleway|Roboto|Roboto+Condensed|Source+Sans+Pro";.nl-form-body *{color:#000;font-family:Arial;font-size:14px;line-height:1.1em;list-style-type:disc;list-style-position:outside;margin:0;padding:0;vertical-align:top;}.nl-form-body h1{color:#005962;font-size:1.6em;height:auto;padding:0;}.nl-form-body ul{padding:8px 24px;}.nl-form-body{background-color:#ffffff;border:solid 0pxrgb(31, 193, 211);box-sizing:border-box;margin:10px auto;padding:48px 30%;width:100%;}.nl-form-body .element{box-sizing:border-box;display:inline-block;margin:0;padding:8px 4%;width:100%;}.nl-form-body .element *{vertical-align:baseline;}.nl-form-body .element .validation{color:#ff0000;display:none;font-weight:bold;}.nl-form-body .element.invalid .validation{display:block !important;}
            .nl-form-body .element .first{float:left;width:100%;}.nl-form-body .element .second{padding-left:0;}.nl-form-body .first label{color:#005962;display:block;font-size:1.1em;font-weight:bold;margin:0 0 0.1em;padding:0 0 2px 0;}
            .nl-form-body .element.mandatory .first label::after{content:"*";}.nl-form-body p.descr{color:#005962;font-size:0.9em;line-height:1.1em;margin:0 0 0.1em;padding:0 0 2px 0;}.nl-form-body .element sub{vertical-align:sub;}
            .nl-form-body .element sup{vertical-align:super;}.nl-form-body .first p.descr{display:none !important;}.nl-form-body .second label{color:#005962;}.nl-form-body button,.nl-form-body input[type=text],.nl-form-body select,.nl-form-body textarea
            {border:solid 1px #ccc;box-sizing:border-box;display:inline-block;margin:0 0 0.2em;
            padding:4px;width:100%;line-height:initial;}.nl-form-body .element.invalid input[type=text],
            .nl-form-body .element.invalid select,.nl-form-body .element.invalid textarea{border:solid 1px #ff0000;}.nl-form-body input[type=checkbox],.nl-form-body input[type=radio]{border:solid 1px #ccc;
            box-sizing:border-box;display:inline-block;margin:2px 4px 0.2em;}.nl-form-body button{color:#ffffff;padding:0.3em 0;background-color:#005962;background:linear-gradient(#005962, #005962);border:solid 0px #005962;text-align:center;}.formassi_element_paragraph, .formassi_element_paragraph * {color:#005962;}#fa_0{width:100%;}#fa_1{width:100%;}#fa_2{width:100%;}#fa_3{width:100%;}#fa_4{width:100%;}#fa_5{width:100%;}#fa_6{width:100%;}#fa_7{width:100%;}#fa_7>div{height:24px;}#fa_8{width:50%;}#fa_9{width:50%;}#fa_9>div{height:24px;}#fa_10{width:50%;}#fa_11{width:50%;}#fa_12{width:100%;}#fa_13{width:100%;}input.datetime, input.date, input.time{
	background-position:right center;
	background-repeat:no-repeat;
	cursor:pointer;
}
span.calendar{
    float: right;
    margin-right: 17px;
    margin-top: -26px;
    position: relative;
    z-index: 2;
    color: #767b81;

}
.calendar::after{
    content: "073";
    font-family: 'FontAwesome regular' !important;
    font-size: 15px;
}

.datetimepicker {
	-webkit-user-select: none;
	-moz-user-select: none;
	-khtml-user-select: none;
	-ms-user-select: none;
	z-index: 9999;
	padding: 0px;
	margin: 0px;
	width: 300px;
	font-size: 11px;
	font-family: Tahoma;
	border: 1px solid #b0bac4;
	position: absolute;
	display: none;
}

/****** NAVIGATION ******/
div.dtpnav {
	width: 100%;
	height: 25px;
}

.dtpnavarrowleft {
	cursor: pointer;
	float: left;
	margin-top: 0px;
	margin-left: 0px;
	width: 24px;
	height: 25px;
}
.dtpnavarrowleftimg {
	margin-left: 8px;
	margin-top:6px
}

div.dtpnavmonthyearsel {
	float: left;
	font-weight: bold;
	min-width: 180px;
	text-align: center;
}


.dtpnavarrowright {
	cursor: pointer;
	float: left;
	margin-top: 0px;
	margin-right: 0px;
	width: 24px;
	height: 25px;
}

.dtpnavarrowrightimg {
	margin-left: 8px;
	margin-top:6px
}



/****** MONTH-SELECTION ******/
.dtpmonthsel {
	cursor: pointer;
	display: inline-block;
	margin-right: 2px;
}

.dtpmonthshow {
	float:left;
	line-height: 24px;
	color: #FFF;
}

.dtpmonthshowimg {
	width: 13px;
	height: 26px;
	float: left;
	background-repeat: no-repeat;
	background-position: 4px 10px;
}

.dtpyearsel {
	cursor: pointer;
	display: inline-block;
	margin-left: 2px;
}

div.dtpyearselbox {
	height: 184px;
	overflow: hidden;
	width: 228px;
	background-color: #fff;
	border: 1px solid #b0bac4;
	font-family: Tahoma;
	font-size: 10px;
	display: none;
	position: absolute;
	left: -1px;
	top: 24px;
}

div.dtpyearselboxleft {
	height: 182px;
	width: 34px;
	margin: 1px;
	float: left;
	cursor: pointer;
}


div.dtpyearselboxright {
	height: 182px;
	width: 33px;
	margin: 1px;
	float: left;
	cursor: pointer;
}

.dtpyearshow {
	float: left;
	line-height: 24px;
	color: #FFF;
}

.dtpyearshowarrowimg {
	width: 13px;
	height: 26px;
	float: left;
	background-repeat: no-repeat;
	background-position: 4px 10px;
}

/***** YEAR-BOX ******/
.dtpyearbox {
	height: 182px;
	width: 156px;
	background-color: #fff;
	float:left;
}

.dtpyearboxselul {
	margin-left: 0px;
	list-style-type: none;
	padding-left: 0px;
	border-bottom: 1px solid #fff;
	margin-bottom: 0px;
	background-color: #fff;
}

.dtpyearboxselli {
	float: left;
	margin-bottom:1px;
	text-align: center;
}

/********** CAL ************/
.dtpcalendar {
	width: 100%;
	background-color: #fcfdff;
	border-top: 1px solid #b0bac4;
}

.dtpcalrow {
	margin-left: 0px;
	list-style-type: none;
	padding-left: 0px;
	margin-top: 0px;
	margin-bottom: 0px;
}

.calField {
	float:left;
	text-align: center;
	cursor: pointer !important;
}

.disabledCalField {
	float:left;
	text-align: center;
	background-color: #757575 !important;
cursor: default;
}

.notThisMonthField {
	background-color: #fff !important;
	margin-bottom: 1px !important;
}

/******* TIME *********/
.dtptimearea {
	width: 100%;
	height: 25px;
	color: #34404b;
	font-weight: bold;
	text-align: center;
}

.dtptimeclock {
	vertical-align: top;
	margin-right: 10px;
	margin-top: 4px;
	cursor: pointer;
	display: inline-block;
	width: 16px;
	height: 16px;
}

.dtphoursel {
	margin-right: 2px;
	display: inline-block;
	cursor: pointer;
}

.dtphoursel1 {
	width: 9px;
	height: 6px;
	margin-right: 2px;
	margin-top: 9px;
	float: left;
}

.dtphoursel2 {
	float: right;
	line-height: 24px;
}

.dtphourselectbox {
	font-weight: normal;
	top: 24px;
	height: 184px;
	width: 228px;
	background-color: #fff;
	border: 1px solid #b0bac4;
	font-family: Tahoma;
	font-size: 10px;
	display: none;
	position: absolute;
	left: -1px;
}

.dtphourul {
	margin-left: 0px;
	list-style-type: none;
	padding-left: 0px;
	margin-top: 0px;
	margin-bottom: 1px;
}

.dtphouril {
	float: left;
	width: 56px;
	margin-bottom: 1px;
	text-align: center;
	cursor: pointer;
	margin-left: 1px;
}

.dtpdblp {
	line-height: 24px;
	display: inline-block;
	vertical-align: top;
}

.dtpminutesel {
	margin-right: 2px;
	display: inline-block;
	cursor: pointer;
}

.dtpminutesel1 {
	float: left;
	line-height: 24px;
	margin-left:2px;
}

.dtpminutesel2 {
	width: 9px;
	height: 6px;
	margin-left: 3px;
	margin-top: 9px;
	float: right;
}

.dtpminuteselectbox {
	font-weight: normal;
	top: 24px;
	left: -1px;
	height: 184px;
	width: 228px;
	background-color: #fff;
	border: 1px solid #b0bac4;
	font-family: Tahoma;
	font-size: 10px;
	display: none;
	position: absolute;
}

.dtpminuteul {
	margin-left: 0px;
	list-style-type: none;
	padding-left: 0px;
	margin-top: 0px;
	margin-bottom: 1px;
}

.dtpminuteil {
	float: left;
	text-align: center;
	margin-bottom: 1px;
	cursor: pointer;
	margin-left: 1px;
}

.dtptimeselarea {
	font-weight: normal;
	left: -1px;
	top: 24px;
	height: 184px;
	width: 228px;
	background-color: #fff;
	border: 1px solid #b0bac4;
	font-family: Tahoma;
	font-size: 10px;
	display: none;
	position: absolute;
}

.dtptimeselarealeft {
	height: 100%;
	width: 100px;
	float:left;
}
.dtptimeselarealeftarrowup {
	width: 100%;
	background-repeat: no-repeat;
	height: 50px;
	cursor: pointer;
}
.dtptimeselarealeftnumber {
	width: 100%;
	height: 84px;
	vertical-align: middle;
	text-align: center;
	line-height: 84px;
	font-size: 36pt;
}

.dtptimeselarealeftarrowdown {
	width: 100%;
	background-repeat: no-repeat;
	height: 50px;
	cursor: pointer;
}

.dtptimeselareamiddle {
	vertical-align: middle;
	text-align: center;
	line-height: 170px;
	font-size: 42pt;
	width: 28px;
	float:left;
}

.dtptimeselarearight {
	height: 100%;
	width: 100px;
	float:left;
}
.dtptimeselarearightarrowup {
	width: 100%;
	background-repeat: no-repeat;
	height: 50px;
	cursor: pointer;
}
.dtptimeselarearightnumber {
	width: 100%;
	height: 84px;
	vertical-align: middle;
	text-align: center;
	line-height: 84px;
	font-size: 36pt;
}
.dtptimeselarearightarrowdown {
	width: 100%;
	background-repeat: no-repeat;
	height: 50px;
	cursor: pointer;
}

/***** MONTH SELECTION BOX *****/
div.dtpmonthbox {
	height: 184px;
	width: 228px;
	background-color: #FFF;
	border: 1px solid #b0bac4;
	font-family: Tahoma;
	font-size: 10px;
	color: #000;
	display: none;
	position: absolute;
	left: -1px;
	top: 24px;
}

ul.dtpmonthrow {
 	margin-left: 0px;
 	float:left;
 	list-style-type: none;
 	width:100%;
 	padding-left: 0px;
 	margin-top: 0px;
 	margin-bottom: 1px;
}

il.dtpmonthcell {
	float: left;
	text-align: center;
	line-height: 45px;
	border-left: 1px solid #fff;
	cursor: pointer;
}


/***** BUTTONS *****/
.dtpbuttons {
	width: 100%;
	height: 25px;
	border-top: 1px solid #b0bac4;
	text-align: center;
}

.dtpbuttonsul {
	margin-left: 0px;
	list-style-type: none;
	padding-left: 0px;
	margin-top: 0px;
	margin-bottom: 0px;
	height: 25px;
	background-color: #FFF;
}

.dtpbuttonsborder {
	line-height: 25px;
	margin-right: 1px;
	background-color: rgb(48, 52, 58);
	text-align: center;
	float: left;
	color:#FFF;
	cursor: pointer;
}

.dtpbuttonsnoborder {
	line-height: 25px;
	text-align: center;
	background-color: rgb(48, 52, 58);
	float: left;
	color:#FFF;
	cursor: pointer;
	width: 75px;
}

/***** IE-FIX *****/
.iefix {
	min-width: 180px;
	float: left;
	font-weight: bold;
	color: #fff;
	text-align: center;
}

.rightiefix {
	position: absolute;
	right: 0;
	top: 0;
}

.leftiefix {
	position: absolute;
	left: 0;
	top: 0;
}
.color3{
    background-color:-mw-settings-colors-system-link_hover-!important;
}

</style>

<script type="text/javascript">
function validateInputs (e){var makeValid = function(id){document.getElementById(id).className = "element mandatory";};var makeInvalid = function(id, msg){document.getElementById(id).className = "element mandatory invalid";};
/* BEGIN ELEMENTS */try{var validmail = new RegExp("^[a-zA-Z0-9_.\-]+@[a-zA-Z0-9_.\-]+\.[a-zA-Z0-9]{2,13}$");var value = document.getElementById("fa_6").getElementsByTagName("input")[0].value;if(value && !validmail.test(value)) throw "Please complete the required field.";if(document.getElementById("fa_6").getElementsByTagName("input")[0].value.match(/^s*$/)) throw "Please complete the required field.";makeValid("fa_6");}catch(exception){makeInvalid("fa_6", exception);e.preventDefault();}try{if(document.getElementById("fa_12").getElementsByTagName("input")[0].checked!=true) throw "boolean validation error";makeValid("fa_12");}catch(exception){makeInvalid("fa_12", exception);e.preventDefault();}/* END ELEMENTS */
}window.addEventListener("load", function(e){document.getElementById("optin_form").addEventListener("submit", validateInputs);});/* BEGIN DTP *//* END DTP */
</script>

<form id="optin_form"  action="https://news.xitaso.com/optin/optin/execute" method="post" accept-charset="utf-8"><div class="nl-form-body">
<!-- BEGIN ELEMENTS --><input name="account_id"  value="35684" type="hidden" /><input name="account_code"  value="GZ1b4" type="hidden" /><input name="optinsetup_id"  value="3" type="hidden" /><input name="optinsetup_code"  value="xNVzQ" type="hidden" />
            <input id="fa_4" name="ic"  value="" type="hidden" />
            <script>
                setInterval(function(){
                    var el=document.getElementById("fa_4");
                    if(el){
                        if (isNaN(parseInt(el.value)) == true){
                          el.value = 0;
                        }
                        else{
                          el.value = parseInt(el.value) + 17;
                        }
                    }
                }, 1000);
            </script>
        <div id="fa_5" class="element"><h1>Subscribe to the Mnestix newsletter</h1></div><div id="fa_6" class="element mandatory"><div class="validation">Please complete the required field.</div><div class="first"><label>E-Mail</label><p class="descr">*Required Field</p></div><div class="second"><input name="fields[1]" type="text" value="" /><p class="descr">*Required Field</p></div></div><div id="fa_7" class="element"><div></div></div><div id="fa_8" class="element"><div class="validation"></div><div class="first"><label>Salutation</label></div><div class="second"><div><select name="fields[2]"><option   value=""></option><option   value="Herr">Herr</option><option   value="Frau">Frau</option><option   value="Mr.">Mr.</option><option   value="Mrs.">Mrs.</option></select></div></div></div><div id="fa_9" class="element"><div></div></div><div id="fa_10" class="element"><div class="validation"></div><div class="first"><label>First Name</label></div><div class="second"><input name="fields[3]" type="text" value="" /></div></div><div id="fa_11" class="element"><div class="validation"></div><div class="first"><label>Last Name</label></div><div class="second"><input name="fields[4]" type="text" value="" /></div></div><div id="fa_12" class="element mandatory"><div class="validation"></div><div class="first"></div><div class="second"><div><input  name="fields[8]" type="checkbox" value="1"><label>I have read and accept the privacy policy.*</label></div></div></div><div id="fa_13" class="element"><div class="validation"></div><div class="first"></div><div class="second"><button type="submit" >Subscribe</button></div></div><!-- END ELEMENTS -->
</div></form>