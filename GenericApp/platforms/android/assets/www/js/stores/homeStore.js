define (function (require) {
  var appDispatcher = require ("util/appDispatcher");
  var EventEmitter = require ("event-emitter").EventEmitter;
  var assign = require ("object-assign");

  var homeMenuItems = ["MS_INC_ACTUAL_INJURY","MS_INC_POTENTIAL_INJ_FORM","MS_INC_FEEDBACK"];
  var potentialInjuryFormItems = ["PSD","FLY","WAB", "SBR","DGR","EQD","PRD", "PAE"];
  var actualInjuryFormItems = ["PSD","FLY","EQD"];

  var store = assign ({}, EventEmitter.prototype, {

    getHomeMenuItems:function()
    {
      return homeMenuItems;
    },
    getPotentialInjuryFormItems:function()
    {
      return potentialInjuryFormItems;
    },
    getActualInjuryFormItems:function()
    {
      return actualInjuryFormItems;
    }

  });

  return store;

});
