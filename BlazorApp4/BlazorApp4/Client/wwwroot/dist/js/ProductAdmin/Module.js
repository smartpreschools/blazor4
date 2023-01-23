var Module = (function () {

    //#region Ready Function Start Point
    $(document).ready(function () {
        BindModuleList();
    });
    //#endregion

    //#region Bind Module List
    function BindModuleList() {
        var BindModuleSuccess = function (result) {
            if (result != "" || result.length > 0) {

            }
        }

        var url = '/ProductAdmin/Master/GetModuleList/';
        CommonUtility.RequestAjax('GET', url, "", BindModuleSuccess, null, null, null);
    }
    //#endregion

    //#region Add New Module
    $('body').on('click', "#btnSubmit", function () {
        var moduleName = CommonUtility.ScriptInjection($("#txtModuleName").val()).replace(/</g, "").replace(/>/g, "");
        var controllerName = CommonUtility.ScriptInjection($("#txtControllerName").val()).replace(/</g, "").replace(/>/g, "");
        var actionName = CommonUtility.ScriptInjection($("#txtActionName").val()).replace(/</g, "").replace(/>/g, "");
        var moduleDesc = CommonUtility.ScriptInjection($("#txtModuleDesc").val()).replace(/</g, "").replace(/>/g, "");
        var moduleStatus = $("#ddlModuleStatus").val();
        if (moduleName!= "") {
            AddModule(moduleName, controllerName, actionName, moduleDesc, moduleStatus);
        }
        else {
            CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtModuleName");
            CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtControllerName");
            CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtActionName");
            
        }
    });

    function AddModule(moduleName, controllerName, actionName, moduleDesc, moduleStatus) {

        var ModuleSuccess = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                CommonUtility.SucessMessagePopUp("Module saved successfully.");
            }
        }
        var data = {
            ModuleName: moduleName,
            ControllerName: controllerName,
            ActionName: actionName,
            ModuleDesc: moduleDesc,
            Status: moduleStatus
        };
        var url = '/ProductAdmin/Master/Module/';
        CommonUtility.RequestAjax('POST', url, data, ModuleSuccess, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#txtModuleName'), $('#txtControllerName'), $('#txtActionName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtModuleName");
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtControllerName");
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtActionName");
        
    });
    //#endregion

    //#region clear Module controls
    $('body').on('click', "#btnClear", function () {
        Clear();
    });

    function Clear() {
        $("#txtModuleName").val("");
        $("#txtControllerName").val("");
        $("#txtActionName").val("");
        $("#txtModuleDesc").val("");
    }
    //#endregion

    //#region Function return
    return {
        BindModuleList: BindModuleList,
        AddModule: AddModule,
        Clear: Clear
    }
    //#endregion

})();

