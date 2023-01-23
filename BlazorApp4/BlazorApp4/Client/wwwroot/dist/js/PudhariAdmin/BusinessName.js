var BusinessName = (function () {

    //#region Ready Function Start Point
    $(document).ready(function () {
        BindBusinessNameList();
    });
    //#endregion
    var optionSelect = "<option value='0' selected>Select value.. </option";
   
    //#region Bind Busness Name List
    function BindBusinessNameList() {
        var ValiditySuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $('#businessNamelist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'Name' },
                        { data: 'Status' },
                        {
                            "data": "Id",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editBusinessName" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deleteBusinessName" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/PudhariAdmin/Business/GetBusinessNameList/';
        CommonUtility.RequestAjax('POST', url, "", ValiditySuccess, null, null, null);
    }
    //#endregion

    //#region Add New Category
    $('body').on('click', "#btnSubmit", function () {
        var name = CommonUtility.ScriptInjection($("#txtName").val()).replace(/</g, "").replace(/>/g, "");
        var status = CommonUtility.ScriptInjection($("#ddlStatus").val()).replace(/</g, "").replace(/>/g, "");
        var businessNameId = CommonUtility.ScriptInjection($("#hdnBusinessNameId").val()).replace(/</g, "").replace(/>/g, "");

        var nameCheck = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtName");

        if (nameCheck) {
            if (businessNameId != "")
                UpdateBusinessName(name, status, businessNameId)
            else
                AddBusinessName(name, status);
        }
    });

    function AddBusinessName(name, status) {
        var ValiditySuccess = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                BindBusinessNameList();
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("Business name saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("Business name exists, could you try another name.");
            }
        }
        var data = {
            Name: name,
            Status: status,
        };
        var url = '/PudhariAdmin/Business/AddBusinessName/';
        CommonUtility.RequestAjax('POST', url, data, ValiditySuccess, null, null, null);
    }

    function UpdateBusinessName(name, status, businessNameId) {
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                CommonUtility.SucessMessagePopUp("Business name updated successfully.");
                BindBusinessNameList();
            }
        }
        var data = {
            Id: businessNameId,
            Name: name,
            Status: status,
        };
        var url = '/PudhariAdmin/Business/UpdateBusinessName/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#txtName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtName");
    });

    //#endregion

    //#region clear PoliticalParty controls
    $('body').on('click', "#btnClear", function () {
        Clear();
    });

    function Clear() {
        $("#ddlStatus").val("True");
        $("#txtName").val("");
        $("#hdnBusinessNameId").val("");
        $("#errtxtName").html("").hide();
    }
    //#endregion

    //#region delete Category
    $('body').on('click', "#deleteBusinessName", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete business name", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeleteBusinessName(id);
    });
    function DeleteBusinessName(id) {
        var id = CommonUtility.ScriptInjection(id).replace(/</g, "").replace(/>/g, "");
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("Business name deleted successfully.");
                BindBusinessNameList();
                Clear();
            }
        }
        var data = {
            Id: id
        };
        var url = '/PudhariAdmin/Business/DeleteBusinessName/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editBusinessName", function () {
        var id = $(this).attr('data-value');
        var BindSuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#txtName").val(result.Name);
                $("#ddlStatus").val(result.Status);
                $("#hdnBusinessNameId").val(result.Id);
            }
        }
        var data = {
            Id: id
        };
        var url = '/PudhariAdmin/Business/GetBusinessNameById/';
        CommonUtility.RequestAjax('GET', url, data, BindSuccess, null, null, null);
    });
    //#endregion

    //#region Function return
    return {
        BindBusinessNameList: BindBusinessNameList,
        AddBusinessName: AddBusinessName,
        Clear: Clear,
        DeleteBusinessName: DeleteBusinessName
    }
    //#endregion

})();



