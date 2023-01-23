var BusinessDetails = (function () {

    //#region Ready Function Start Point
    $(document).ready(function () {
        BindDropdown("#ddlBusinessName", "BusinessName", "", true);
        BindBusinessDetailsList();
    });
    //#endregion
    var optionSelect = "<option value='0' selected>Select value.. </option";
    //#region Bind DropDown  List
    function BindDropdown(contrlID, DrpName, inputValue, isAsync) {
        var BindDropDownData = function (result) {
            if (result != "" || result.length > 0) {
                $(contrlID + " option").remove();
                $.map(result, function (opt) {
                    var option = $('<option>' + opt.Name + '</option>');
                    option.attr('value', opt.Id);
                    $(contrlID).append(option);
                });
                $(contrlID + " option").remove("0");
                $(contrlID).prepend(optionSelect);
            }
        }
      
        var url = '/PudhariAdmin/Business/GetActiveBusinessNames/';
        if (isAsync)
            CommonUtility.RequestAjax('GET', url, "", BindDropDownData, null, null, null);
        else
            CommonUtility.RequestAjaxAsync('GET', url, "", BindDropDownData, null, null, null);

    }

    //#region Bind Busness Details List
    function BindBusinessDetailsList() {
        var ValiditySuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $('#businessDetails').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'Name' },
                        { data: 'Address' },
                        { data: 'Mobile' },
                        { data: 'Status' },
                        {
                            "data": "Id",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editBusinessDetails" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deleteBusinessDetails" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/PudhariAdmin/Business/GetBusinessDetailsList/';
        CommonUtility.RequestAjax('POST', url, "", ValiditySuccess, null, null, null);
    }
    //#endregion

    //#region Add New Category
    $('body').on('click', "#btnSubmit", function () {
        var busineeName = CommonUtility.ScriptInjection($("#ddlBusinessName").val()).replace(/</g, "").replace(/>/g, "");
        var address = CommonUtility.ScriptInjection($("#txtAddress").val()).replace(/</g, "").replace(/>/g, "");
        var mobile = CommonUtility.ScriptInjection($("#txtMobile").val()).replace(/</g, "").replace(/>/g, "");
        var phone = CommonUtility.ScriptInjection($("#txtPhone").val()).replace(/</g, "").replace(/>/g, "");
        var email = CommonUtility.ScriptInjection($("#txtEmail").val()).replace(/</g, "").replace(/>/g, "");
        var website = CommonUtility.ScriptInjection($("#txtWebsite").val()).replace(/</g, "").replace(/>/g, "");
        var desc = $("#txtDesc").summernote('code');

        var status = CommonUtility.ScriptInjection($("#ddlStatus").val()).replace(/</g, "").replace(/>/g, "");
        var businessDetailsId = CommonUtility.ScriptInjection($("#hdnBusinessDetailsId").val()).replace(/</g, "").replace(/>/g, "");

        var busineeNameCheck = CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlBusinessName");
        var addressCheck = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtAddress");
        var mobileCheck = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtMobile");

        if (busineeNameCheck && addressCheck && mobileCheck) {
            if (businessDetailsId != "")
                UpdateBusinessDetails(busineeName, address, mobile, phone, email, website,desc,status, businessDetailsId)
            else
                AddBusinessDetails(busineeName, address, mobile, phone, email, website,desc,status);
        }
    });

    function AddBusinessDetails(busineeName, address, mobile, phone, email, website,desc,status) {
        var ValiditySuccess = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                BindBusinessDetailsList();
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("Business name saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("Business name exists, could you try another name.");
                if (result === 100)
                    CommonUtility.SucessMessagePopUp("Mandetory input data is incorrect.");
            }
        }
        var data = {
            Name: busineeName,
            Address: address,
            Mobile: mobile,
            Phone: phone,
            Email: email,
            Website: website,
            Description: desc,
            Status: status,
        };
        var url = '/PudhariAdmin/Business/AddBusinessDetails/';
        CommonUtility.RequestAjax('POST', url, data, ValiditySuccess, null, null, null);
    }

    function UpdateBusinessDetails(busineeName, address, mobile, phone, email, website,desc,status, businessDetailsId) {
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                CommonUtility.SucessMessagePopUp("Business details updated successfully.");
                BindBusinessDetailsList();
            }
        }
        var data = {
            Id: businessDetailsId,
            Name: busineeName,
            Address: address,
            Mobile: mobile,
            Phone: phone,
            Email: email,
            Website: website,
            Description: desc,
            Status: status,
        };
        var url = '/PudhariAdmin/Business/UpdateBusinessDetails/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#ddlBusinessName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("DROPDWN", "ddlBusinessName");
    });
    $('#txtAddress').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtAddress");
    });
    $('#txtMobile').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtMobile");
    });

    //#endregion

    //#region clear PoliticalParty controls
    $('body').on('click', "#btnClear", function () {
        Clear();
    });

    function Clear() {
        $("#ddlStatus").val("True");
        $("#ddlBusinessName").val("0");
        $("#txtAddress").val("");
        $("#txtMobile").val("");
        $("#txtPhone").val("");
        $("#txtEmail").val("");
        $("#txtWebsite").val("");

        $("#txtDesc").summernote("reset");

        $("#hdnBusinessDetailsId").val("");
        $("#errtxtAddress").html("").hide();
        $("#errtxtMobile").html("").hide();
        $("#errddlBusinessName").html("").hide();
    }
    //#endregion

    //#region delete Category
    $('body').on('click', "#deleteBusinessDetails", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete business name", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeleteBusinessDetails(id);
    });
    function DeleteBusinessDetails(id) {
        var id = CommonUtility.ScriptInjection(id).replace(/</g, "").replace(/>/g, "");
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("Business details deleted successfully.");
                BindBusinessDetailsList();
                Clear();
            }
        }
        var data = {
            Id: id
        };
        var url = '/PudhariAdmin/Business/DeleteBusinessDetails/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editBusinessDetails", function () {
        var id = $(this).attr('data-value');
        var BindSuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#ddlBusinessName").val(result.Name);
                $("#txtAddress").val(result.Address);
                $("#txtMobile").val(result.Mobile);
                $("#txtPhone").val(result.Phone);
                $("#txtEmail").val(result.Email);
                $("#txtWebsite").val(result.Website);
                $("#txtDesc").summernote("code", result.Description);
                $("#ddlStatus").val(result.Status);
                $("#hdnBusinessDetailsId").val(result.Id);
            }
        }
        var data = {
            Id: id
        };
        var url = '/PudhariAdmin/Business/GetBusinessDetailsById/';
        CommonUtility.RequestAjax('GET', url, data, BindSuccess, null, null, null);
    });
    //#endregion

    //#region Function return
    return {
        BindBusinessDetailsList: BindBusinessDetailsList,
        AddBusinessDetails: AddBusinessDetails,
        Clear: Clear,
        DeleteBusinessDetails: DeleteBusinessDetails
    }
    //#endregion

})();



