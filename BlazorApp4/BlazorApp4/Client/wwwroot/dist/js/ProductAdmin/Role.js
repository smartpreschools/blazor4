var Role = (function () {

    //#region Ready Function Start Point
    $(document).ready(function () {
        BindRoleList();
    });
    //#endregion

    //#region Bind Role List
    function BindRoleList() {
        var BindRoleSuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $('#rolelist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'RoleName' },
                        { data: 'RoleDesc' },
                        {
                            data: "Status",
                            render: function (data, type, row) {
                                if (data === "True") { return "Active" }
                                else return "InActive"
                            }
                        },
                        {
                            "data": "RoleID",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editRole" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deleteRole" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/ProductAdmin/Master/GetRoleList/';
        CommonUtility.RequestAjax('POST', url, "", BindRoleSuccess, null, null, null);
    }
    //#endregion

    //#region Add New Role
    $('body').on('click', "#btnSubmit", function () {
        var roleName = CommonUtility.ScriptInjection($("#txtRoleName").val()).replace(/</g, "").replace(/>/g, "");
        var roleDesc = CommonUtility.ScriptInjection($("#txtRoleDesc").val()).replace(/</g, "").replace(/>/g, "");
        var roleID = CommonUtility.ScriptInjection($("#hdnRoleID").val()).replace(/</g, "").replace(/>/g, "");
        var roleStatus = $("#ddlRoleStatus").val();
        if (roleName != "") {
            if (roleID != "")
                UpdateRole(roleName, roleDesc, roleStatus, roleID);
            else
                AddRole(roleName, roleDesc, roleStatus);
        }
        else {
            CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtRoleName");
        }
    });

    function AddRole(roleName, roleDesc, roleStatus) {

        var RoleSuccess = function (result) {
            if (result != "" || result.length > 0) {
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("Role saved successfully..");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("Role already exists, could you try another name.");
                Clear();
                BindRoleList();
            }
        }
        var data = {
            RoleName: roleName,
            RoleDesc: roleDesc,
            Status: roleStatus
        };
        var url = '/ProductAdmin/Master/Role/';
        CommonUtility.RequestAjax('POST', url, data, RoleSuccess, null, null, null);
    }
    function UpdateRole(roleName, roleDesc, roleStatus, roleID) {

        var CategorySuccess = function (result) {
            if (result != "" || result.length > 0) {
                CommonUtility.SucessMessagePopUp("Role updated successfully.");
                Clear();
                BindRoleList();
            }
        }
        var data = {
            RoleID: roleID,
            RoleName: roleName,
            RoleDesc: roleDesc,
            Status: roleStatus
        };
        var url = '/ProductAdmin/Master/UpdateRole/';
        CommonUtility.RequestAjax('POST', url, data, CategorySuccess, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#txtRoleName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtRoleName");
    });
    //#endregion

    //#region clear Role controls
    $('body').on('click', "#btnClear", function () {
        Clear();
    });

    function Clear() {
        $("#txtRoleName").val("");
        $("#txtRoleDesc").val("");
        $("#hdnRoleID").val("");

        $("#errtxtRoleName").html("").hide();
    }
    //#endregion

    //#region delete Category
    $('body').on('click', "#deleteRole", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete Role", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeleteRole(id);
    });
    function DeleteRole(RoleID) {
        var roleID = CommonUtility.ScriptInjection(RoleID).replace(/</g, "").replace(/>/g, "");
        var RoleSuccess = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("Role Deleted successfully.");
                BindRoleList();
                Clear();
            }
        }
        var data = {
            RoleID: roleID
        };
        var url = '/ProductAdmin/Master/DeleteRole/';
        CommonUtility.RequestAjax('POST', url, data, RoleSuccess, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editRole", function () {
        var roleID = $(this).attr('data-value');
        var BindRoleSuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#txtRoleName").val(result.RoleName);
                $("#txtRoleDesc").val(result.RoleDesc);
                $("#ddlRoleStatus").val(result.Status);
                $("#hdnRoleID").val(result.RoleID);
            }
        }
        var data = {
            RoleID: roleID
        };
        var url = '/ProductAdmin/Master/GetRoleByID/';
        CommonUtility.RequestAjax('GET', url, data, BindRoleSuccess, null, null, null);
    });
    //#endregion
    //#region Function return
    return {
        BindRoleList: BindRoleList,
        AddRole: AddRole,
        Clear: Clear,
        DeleteData: DeleteData,
        DeleteRole: DeleteRole
    }
    //#endregion

})();



