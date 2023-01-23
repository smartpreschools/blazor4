var Menu = (function () {
    //#region Ready Function Start Point
    $(document).ready(function () {
        BindDropdown("#ddlParentMenu", "ActiveMenu", "Customer", true);
        BindMenuList();
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
    function BindMenuList() {
        var Success = function (result) {
            if (result != "" || result.length >= 0) {
                $('#menulist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'ParentMenu' },
                        { data: 'MenuName' },
                        { data: 'MenuOrder' },
                        {
                            data: "Status",
                            render: function (data, type, row) {
                                if (data === "True") { return "Active" }
                                else return "InActive"
                            }
                        },

                        {
                            "data": "MenuID",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editMenu" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deleteMenu" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/PudhariAdmin/PageAdmin/GetMenuList/';
        CommonUtility.RequestAjax('POST', url, "", Success, null, null, null);
    }
    //#endregion

    //#region Add New Category
    $('body').on('click', "#btnSubmit", function () {
        var parentMenu = CommonUtility.ScriptInjection($("#ddlParentMenu").val()).replace(/</g, "").replace(/>/g, "");
        var menuName = CommonUtility.ScriptInjection($("#txtMenuName").val()).replace(/</g, "").replace(/>/g, "");
        var menuOrder = CommonUtility.ScriptInjection($("#txtMenuOrder").val()).replace(/</g, "").replace(/>/g, "");
        var status = CommonUtility.ScriptInjection($("#ddlStatus").val()).replace(/</g, "").replace(/>/g, "");
        var menuID = CommonUtility.ScriptInjection($("#hdnMenuID").val()).replace(/</g, "").replace(/>/g, "");

        var menuNameStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtMenuName");

        if (menuNameStatus) {
            if (menuID != "")
                UpdateMenu(parentMenu, menuName, menuOrder, status, menuID)

            else
                AddMenu(parentMenu, menuName, menuOrder, status);
        }
    });

    function AddMenu(parentMenu, menuName, menuOrder, status, menuID) {
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                BindDropdown("#ddlParentMenu", "ActiveMenu", "Customer", true);
                Clear();
                BindMenuList();
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("Menu saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("Menu Name exists, could you try another name.");
            }
        }
        var data = {
            ParentMenu: parentMenu,
            MenuName: menuName,
            MenuOrder: menuOrder,
            Status: status
        };
        var url = '/PudhariAdmin/PageAdmin/AddMenu/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }

    function UpdateMenu(parentMenu, menuName, menuOrder, status, menuID) {
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                BindDropdown("#ddlParentMenu", "ActiveMenu", "Customer", true);
                Clear();
                CommonUtility.SucessMessagePopUp("Menu updated successfully.");
                BindMenuList();

            }
        }
        var data = {
            MenuID: menuID,
            ParentMenu: parentMenu,
            MenuName: menuName,
            MenuOrder: menuOrder,
            Status: status
        };
        var url = '/PudhariAdmin/PageAdmin/UpdateMenu/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#txtMenuName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtMenuName");
    });
    //#endregion

    //#region clear PoliticalParty controls
    $('body').on('click', "#btnClear", function () {
        Clear();
    });

    function Clear() {
        $("#txtMenuName").val("");
        $("#ddlParentMenu").val("0");
        $("#txtMenuOrder").val("");
        $("#hdnMenuID").val("");

        $("#errtxtMenuName").html("").hide();
    }
    //#endregion

    //#region delete Category
    $('body').on('click', "#deleteMenu", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete menu", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeleteMenu(id);
    });
    function DeleteMenu(MenuID) {
        var menuID = CommonUtility.ScriptInjection(MenuID).replace(/</g, "").replace(/>/g, "");
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                BindDropdown("#ddlParentMenu", "ActiveMenu", "Customer", true);
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("menu deleted successfully.");
                BindMenuList();
                Clear();
            }
        }
        var data = {
            MenuID: menuID
        };
        var url = '/PudhariAdmin/PageAdmin/DeleteMenu/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editMenu", function () {
        var menuID = $(this).attr('data-value');
        var BindSuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#txtMenuName").val(result.MenuName);
                $("#ddlParentMenu").val(result.ParentMenu);
                $("#txtMenuOrder").val(result.MenuOrder);
                $("#ddlStatus").val(result.Status);
                $("#hdnMenuID").val(result.MenuID);
            }
        }
        var data = {
            MenuID: menuID
        };
        var url = '/PudhariAdmin/PageAdmin/GetMenuByID/';
        CommonUtility.RequestAjax('GET', url, data, BindSuccess, null, null, null);
    });
    //#endregion

    //#region Function return
    return {
        BindMenuList: BindMenuList,
        AddMenu: AddMenu,
        Clear: Clear,
        DeleteMenu: DeleteMenu
    }
    //#endregion

})();



