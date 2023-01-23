var MenuContent = (function () {
    //#region Ready Function Start Point
    $(document).ready(function () {
        BindDropdown("#ddlMenuName", "ActiveMenu", "Customer", true);
        BindMenuContentList();
    });
    //#endregion
    var optionSelect = "<option value='0' selected>Select value.. </option";
    //#region Bind DropDown  List
    function BindDropdown(contrlID, DrpName, inputValue, isAsync) {
        var BindDropDownData = function (result) {
            if (result != "" || result.length > 0) {
                $(contrlID + " option").remove();
                $.map(result, function (opt) {
                    var option = $('<option>' + opt.DataName + '</option>');
                    option.attr('value', opt.DataId);
                    $(contrlID).append(option);
                });
                $(contrlID + " option").remove("0");
                $(contrlID).prepend(optionSelect);
            }
        }
        var data = {
            dropName: DrpName,
            inputText: inputValue,
        };
        var url = '/Common/MasterData/GetDropDownData/';
        if (isAsync)
            CommonUtility.RequestAjax('GET', url, data, BindDropDownData, null, null, null);
        else
            CommonUtility.RequestAjaxAsync('GET', url, data, BindDropDownData, null, null, null);

    }

    //#region Bind Category List
    function BindMenuContentList() {
        var Success = function (result) {
            if (result != "" || result.length >= 0) {
                $('#menuContentlist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'MenuName' },
                        { data: 'MenuContent' },
                        {
                            data: "Status",
                            render: function (data, type, row) {
                                if (data === "True") { return "Active" }
                                else return "InActive"
                            }
                        },

                        {
                            "data": "MenuContentID",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editMenuContent" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deleteMenuContent" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/PudhariAdmin/PageAdmin/GetMenuContentList/';
        CommonUtility.RequestAjax('POST', url, "", Success, null, null, null);
    }
    //#endregion

    //#region Add New Category
    $('body').on('click', "#btnSubmit", function () {
        var menuName = CommonUtility.ScriptInjection($("#ddlMenuName").val()).replace(/</g, "").replace(/>/g, "");
        var menuContent = CommonUtility.ScriptInjection($("#txtMenuContent").val()).replace(/</g, "").replace(/>/g, "");
        var status = CommonUtility.ScriptInjection($("#ddlStatus").val()).replace(/</g, "").replace(/>/g, "");
        var menuContentID = CommonUtility.ScriptInjection($("#hdnMenuContentID").val()).replace(/</g, "").replace(/>/g, "");

        var menuStatus = CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlMenuName");
        var menuContentStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtMenuContent");

        if (menuStatus && menuContentStatus) {
            if (menuContentID != "")
                UpdateMenuContent(menuName, menuContent, status, menuContentID)

            else
                AddMenuContent(menuName, menuContent, status);
        }
    });

    function AddMenuContent(menuName, menuContent, status) {
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                BindMenuContentList();
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("Menu content saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("Menu Name and their content exists, could you try another name.");
            }
        }
        var data = {
            MenuName: menuName,
            MenuContent: menuContent,
            Status: status
        };
        var url = '/PudhariAdmin/PageAdmin/AddMenuContent/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }

    function UpdateMenuContent(menuName, menuContent, status, menuContentID) {
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                CommonUtility.SucessMessagePopUp("Menu content updated successfully.");
                BindMenuContentList();

            }
        }
        var data = {
            MenuContentID: menuContentID,
            MenuName: menuName,
            MenuContent: menuContent,
            Status: status
        };
        var url = '/PudhariAdmin/PageAdmin/UpdateMenuContent/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#ddlMenuName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlMenuName");
    });

    $('#txtMenuContent').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtMenuContent");
    });
    //#endregion

    //#region clear PoliticalParty controls
    $('body').on('click', "#btnClear", function () {
        Clear();
    });

    function Clear() {
        $("#ddlMenuName").val("0");
        $("#txtMenuContent").val("");
        $("#hdnMenuContentID").val("");

        $("#errddlMenuName").html("").hide();
        $("#errtxtMenuContent").html("").hide();

    }
    //#endregion

    //#region delete Category
    $('body').on('click', "#deleteMenuContent", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete menu content", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeleteMenuContent(id);
    });
    function DeleteMenuContent(MenuContentID) {
        var menuContentID = CommonUtility.ScriptInjection(MenuContentID).replace(/</g, "").replace(/>/g, "");
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("Menu content deleted successfully.");
                BindMenuContentList();
                Clear();
            }
        }
        var data = {
            MenuContentID: menuContentID
        };
        var url = '/PudhariAdmin/PageAdmin/DeleteMenuContent/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editMenuContent", function () {
        var menuContentID = $(this).attr('data-value');
        var BindSuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#ddlMenuName").val(result.MenuName);
                $("#txtMenuContent").val(result.MenuContent);
                $("#ddlStatus").val(result.Status);
                $("#hdnMenuContentID").val(result.MenuContentID);
            }
        }
        var data = {
            MenuContentID: menuContentID
        };
        var url = '/PudhariAdmin/PageAdmin/GetMenuContentByID/';
        CommonUtility.RequestAjax('GET', url, data, BindSuccess, null, null, null);
    });
    //#endregion

    //#region Function return
    return {
        BindMenuContentList: BindMenuContentList,
        AddMenuContent: AddMenuContent,
        Clear: Clear,
        DeleteMenuContent: DeleteMenuContent
    }
    //#endregion

})();



