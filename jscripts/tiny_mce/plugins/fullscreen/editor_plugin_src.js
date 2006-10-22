/**
 * $Id$
 *
 * @author Moxiecode
 * @copyright Copyright � 2004-2006, Moxiecode Systems AB, All rights reserved.
 */

/* Import plugin specific language pack */
tinyMCE.importPluginLanguagePack('fullscreen');

var TinyMCE_FullScreenPlugin = {
	getInfo : function() {
		return {
			longname : 'Fullscreen',
			author : 'Moxiecode Systems AB',
			authorurl : 'http://tinymce.moxiecode.com',
			infourl : 'http://tinymce.moxiecode.com/tinymce/docs/plugin_fullscreen.html',
			version : tinyMCE.majorVersion + "." + tinyMCE.minorVersion
		};
	},

	initInstance : function(inst) {
		if (!tinyMCE.settings['fullscreen_skip_plugin_css'])
			tinyMCE.importCSS(inst.getDoc(), tinyMCE.baseURL + "/plugins/fullscreen/css/content.css");
	},

	getControlHTML : function(cn) {
		switch (cn) {
			case "fullscreen":
				return tinyMCE.getButtonHTML(cn, 'lang_fullscreen_desc', '{$pluginurl}/images/fullscreen.gif', 'mceFullScreen');
		}

		return "";
	},

	execCommand : function(editor_id, element, command, user_interface, value) {
		// Handle commands
		switch (command) {
			case "mceFullScreen":
				this._toggleFullscreen(tinyMCE.getInstanceById(editor_id));
				return true;
		}

		// Pass to next handler in chain
		return false;
	},

	_toggleFullscreen : function(inst) {
		var ds = inst.getData('fullscreen'), editorContainer, tableElm, iframe, vp, cw, cd, re, w, h;

		cw = inst.getContainerWin();
		cd = cw.document;
		editorContainer = cd.getElementById(inst.editorId + '_parent');
		tableElm = editorContainer.firstChild;
		iframe = inst.iframeElement;
		re = cd.getElementById(inst.editorId + '_resize');

		if (!ds.enabled) {
			ds.oldOverflow = cd.body.style.overflow;
			cd.body.style.overflow = 'hidden';

			if (re)
				re.style.display = 'none';

			vp = tinyMCE.getViewPort(cw);

			tableElm.style.position = 'absolute';
			tableElm.style.zIndex = 1000;
			tableElm.style.left = tableElm.style.top = '0';

			tableElm.style.width = vp.width + 'px';
			tableElm.style.height = vp.height + 'px';

			ds.oldWidth = iframe.style.offsetWidth;
			ds.oldHeight = iframe.style.offsetHeight;

			if (tinyMCE.isRealIE) {
				iframe.style.width = vp.width + 'px';
				iframe.style.height = vp.height + 'px';

				// Calc new width/height based on overflow
				w = iframe.parentNode.clientWidth - (tableElm.offsetWidth - vp.width);
				h = iframe.parentNode.clientHeight - (tableElm.offsetHeight - vp.height);
			} else {
				w = iframe.parentNode.clientWidth;
				h = iframe.parentNode.clientHeight;
			}

			iframe.style.width = w + "px";
			iframe.style.height = h + "px";

			tinyMCE.selectElements(cd, 'SELECT,INPUT,BUTTON,TEXTAREA', function (n) {
				tinyMCE.addCSSClass(n, 'mceItemFullScreenHidden');

				return false;
			});

			tinyMCE.switchClass(inst.editorId + '_fullscreen', 'mceButtonSelected');
			ds.enabled = true;
		} else {
			cd.body.style.overflow = ds.oldOverflow ? ds.oldOverflow : '';

			if (re && tinyMCE.getParam("theme_advanced_resizing", false))
				re.style.display = 'block';

			tableElm.style.position = 'static';
			tableElm.style.width = '';
			tableElm.style.height = '';

			iframe.style.width = ds.oldWidth ? ds.oldWidth : '';
			iframe.style.height = ds.oldHeight ? ds.oldHeight : '';

			tinyMCE.selectElements(cd, 'SELECT,INPUT,BUTTON,TEXTAREA', function (n) {
				tinyMCE.removeCSSClass(n, 'mceItemFullScreenHidden');

				return false;
			});

			tinyMCE.switchClass(inst.editorId + '_fullscreen', 'mceButtonNormal');
			ds.enabled = false;
		}
	}
};

tinyMCE.addPlugin("fullscreen", TinyMCE_FullScreenPlugin);
