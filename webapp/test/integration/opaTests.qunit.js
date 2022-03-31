/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require(["Academia2022/zluuc3tenis/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});
