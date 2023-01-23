var BusinessLead = (function () {
    var data = "";
    var optionSelect = "<option value='0' selected>Select value.. </option";

    //#region Ready Function Start Point
    $(document).ready(function () {
        $("#divList").show();
        BindBusinessLeadList();
    });
    //#endregion

    //#region Bind Role List
    function BindBusinessLeadList() {
        var BindRoleSuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $('#businessLeadlist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'LeadID' },
                        { data: 'FullName' },
                        { data: 'MobileNumber' },
                        { data: 'Email' },
                        { data: 'Address' },
                        {
                            data: "Status",
                            render: function (data, type, row) {
                                if (data === "True") { return "Active" }
                                else return "InActive"
                            }
                        },

                        {
                            "data": "ID",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editBusinessLead" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deleteBusinessLead" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/ProductAdmin/BusinessLead/GetBusinessLeadList/';
        CommonUtility.RequestAjax('POST', url, "", BindRoleSuccess, null, null, null);
    }
    //#endregion

    //#region Add/Update Business Lead
    $('body').on('click', "#btnSubmit", function () {
        var fName = CommonUtility.ScriptInjection($("#txtFirstName").val()).replace(/</g, "").replace(/>/g, "");
        var mName = CommonUtility.ScriptInjection($("#txtMiddleName").val()).replace(/</g, "").replace(/>/g, "");
        var lName = CommonUtility.ScriptInjection($("#txtLastName").val()).replace(/</g, "").replace(/>/g, "");
        var mobileNumber = CommonUtility.ScriptInjection($("#txtMobileNumber").val()).replace(/</g, "").replace(/>/g, "");
        var whatsupNumber = CommonUtility.ScriptInjection($("#txtWhatsupNumber").val()).replace(/</g, "").replace(/>/g, "");
        var email = CommonUtility.ScriptInjection($("#txtEmail").val()).replace(/</g, "").replace(/>/g, "");
        var address = CommonUtility.ScriptInjection($("#txtAddress").val()).replace(/</g, "").replace(/>/g, "");
        var countryID = CommonUtility.ScriptInjection($("#ddlCountry").val()).replace(/</g, "").replace(/>/g, "");
        var stateID = CommonUtility.ScriptInjection($("#ddlState").val()).replace(/</g, "").replace(/>/g, "");
        var districtID = CommonUtility.ScriptInjection($("#ddlDistrict").val()).replace(/</g, "").replace(/>/g, "");
        var talukaID = CommonUtility.ScriptInjection($("#ddlTaluka").val()).replace(/</g, "").replace(/>/g, "");
        var cityID = CommonUtility.ScriptInjection($("#ddlCity").val()).replace(/</g, "").replace(/>/g, "");
        var userName = CommonUtility.ScriptInjection($("#txtUserName").val()).replace(/</g, "").replace(/>/g, "");
        var password = CommonUtility.ScriptInjection($("#txtPassword").val()).replace(/</g, "").replace(/>/g, "");
        var leadStatus = CommonUtility.ScriptInjection($("#ddlLeadStatus").val()).replace(/</g, "").replace(/>/g, "");
        var desc = CommonUtility.ScriptInjection($("#txtDesc").val()).replace(/</g, "").replace(/>/g, "");
        var id = CommonUtility.ScriptInjection($("#hdntxtID").val()).replace(/</g, "").replace(/>/g, "");
        var leadID = CommonUtility.ScriptInjection($("#hdntxtLeadID").val()).replace(/</g, "").replace(/>/g, "");
        var roleID = CommonUtility.ScriptInjection($("#ddlRole").val()).replace(/</g, "").replace(/>/g, "");


        //validation check
        var fNameStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtFirstName");
        var lNameStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtLastName");
        var mobilenumberStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtMobileNumber");
        var userNameStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtUserName");
        var passwordStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtPassword");

        data = {
            ID: id,
            LeadID: leadID,
            FName: fName,
            MName: mName,
            LName: lName,
            MobileNumber: mobileNumber,
            WhatsupNumber: whatsupNumber,
            Email: email,
            Address: address,
            CountryID: countryID,
            StateID: stateID,
            DistrictID: districtID,
            TalukaID: talukaID,
            CityID: cityID,
            Description: desc,
            Status: leadStatus,
            UserName: userName,
            Password: password,
            RoleID: roleID
        };

        if (fNameStatus && lNameStatus && mobilenumberStatus && userNameStatus && passwordStatus) {
            if (id != "")
                UpdateBusinessLead(data)
            else
                AddBusinessLead(data);
        }
    });

    function AddBusinessLead(data) {

        var BusinessLeadSuccess = function (result) {
            if (result != "" || result.length > 0) {
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("Business Lead saved successfully..");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("Role already exists, could you try another name.");
                Clear();
                BindBusinessLeadList();
                data = "";
                $("#divList").show();
                $("#divAdd").hide();
            }
        }

        var url = '/ProductAdmin/BusinessLead/AddBusinessLead/';
        CommonUtility.RequestAjax('POST', url, data, BusinessLeadSuccess, null, null, null);
    }
    function UpdateBusinessLead(data) {

        var UpdateSuccess = function (result) {
            if (result != "" || result.length > 0) {
                CommonUtility.SucessMessagePopUp("Business Lead updated successfully.");
                Clear();
                BindBusinessLeadList();
                data = "";
                $("#divList").show();
                $("#divAdd").hide();
            }
        }

        var url = '/ProductAdmin/BusinessLead/UpdateBusinessLead/';
        CommonUtility.RequestAjax('POST', url, data, UpdateSuccess, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#txtFirstName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtFirstName");
    });
    $('#txtLastName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtLastName");
    });
    $('#txtMobileNumber').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtMobileNumber");
    });
    $('#txtUserName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtUserName");
    });
    $('#txtPassword').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtPassword");
    });

    $('#ddlCountry').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlCountry");
        BindDropdown("#ddlState", "State", $("#ddlCountry").val(), true);
    });

    $('#ddlState').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlState");
        BindDropdown("#ddlDistrict", "District", $("#ddlState").val(), true);

    });
    $('#ddlDistrict').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlDistrict");
        BindDropdown("#ddlTaluka", "Taluka", $("#ddlDistrict").val(), true);
    });
    $('#ddlTaluka').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlTaluka");
        BindDropdown("#ddlCity", "City", $("#ddlTaluka").val(), true);
    });
    //#endregion

    //#region clear Role controls
    $('body').on('click', "#btnClear", function () {
        Clear();
    });

    function Clear() {
        $("#txtFirstName").val("");
        $("#txtMiddleName").val("");
        $("#txtLastName").val("");
        $("#txtMobileNumber").val("");
        $("#txtWhatsupNumber").val("");
        $("#txtEmail").val("");
        $("#txtAddress").val("");
        $("#ddlCountry").val("0");
        $("#ddlState").val("0");
        $("#ddlDistrict").val("0");
        $("#ddlTaluka").val("0");
        $("#ddlCity").val("0");
        $("#txtUserName").val("");
        $("#txtPassword").val("");
        $("#txtDesc").val("");
        $("#hdntxtID").val("");


        $("#errtxtUserName").html("").hide();
        $("#errtxtPassword").html("").hide();
        $("#errtxtFirstName").html("").hide();
        $("#errtxtLastName").html("").hide();
        $("#errtxtMobileNumber").html("").hide();
    }
    //#endregion

    //#region Add new Business lead click
    $('body').on('click', "#AddNew", function () {
        $("#divList").hide();
        $("#divAdd").show();
        BindDropdown("#ddlCountry", "Country", "", true);
        BindDropdown("#ddlRole", "Role", "", true);
    });
    $('body').on('click', "#btnback", function () {
        $("#divList").hide();
        $("#divAdd").show();
    });

    //#endregionn

    //#region delete Category
    $('body').on('click', "#deleteBusinessLead", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete Business Lead", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeleteBusinessLead(id);
    });
    function DeleteBusinessLead(ID) {
        var id = CommonUtility.ScriptInjection(ID).replace(/</g, "").replace(/>/g, "");
        var DeleteSuccess = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("Business Lead Deleted successfully.");
                BindBusinessLeadList();
                Clear();
            }
        }
        var data = {
            ID: id
        };
        var url = '/ProductAdmin/BusinessLead/DeleteBusinessLead/';
        CommonUtility.RequestAjax('POST', url, data, DeleteSuccess, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editBusinessLead", function () {
        var id = $(this).attr('data-value');
        var EditSuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#divList").hide();
                $("#divAdd").show();
                $("#txtFirstName").val(result.FName);
                $("#txtMiddleName").val(result.MName);
                $("#txtLastName").val(result.LName);
                $("#txtMobileNumber").val(result.MobileNumber);
                $("#txtWhatsupNumber").val(result.WhatsupNumber);
                $("#txtEmail").val(result.Email);
                $("#txtAddress").val(result.Address);
                BindDropdown("#ddlCountry", "Country", "", false);
                $("#ddlCountry").val(result.CountryID);
                if (result.CountryID != "0")
                    BindDropdown("#ddlState", "State", result.CountryID, false);
                $("#ddlState").val(result.StateID);
                if (result.StateID != "0")
                    BindDropdown("#ddlDistrict", "District", result.StateID, false);
                $("#ddlDistrict").val(result.DistrictID);
                if (result.DistrictID != "0")
                    BindDropdown("#ddlTaluka", "Taluka", result.DistrictID, false);
                $("#ddlTaluka").val(result.TalukaID);
                if (result.TalukaID != "0")
                    BindDropdown("#ddlCity", "City", result.TalukaID, false);
                $("#ddlCity").val(result.CityID);
                $("#txtUserName").val(result.UserName);
                $("#txtPassword").val(result.Password);
                $("#ddlLeadStatus").val(result.Status);
                $("#txtDesc").val(result.Description);
                $("#hdntxtID").val(result.ID);
                $("#hdntxtLeadID").val(result.LeadID);
                BindDropdown("#ddlRole", "Role", "", false);
                $("#ddlRole").val(result.RoleID);
            }
        }
        var data = {
            ID: id
        };
        var url = '/ProductAdmin/BusinessLead/GetBusinessLeadByID/';
        CommonUtility.RequestAjax('GET', url, data, EditSuccess, null, null, null);
    });
    //#endregion

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
        var url = '/ProductAdmin/Master/GetDropDownData/';
        if (isAsync)
            CommonUtility.RequestAjax('GET', url, data, BindDropDownData, null, null, null);
        else
            CommonUtility.RequestAjaxAsync('GET', url, data, BindDropDownData, null, null, null);

    }
    //#region Function return
    return {
        BindBusinessLeadList: BindBusinessLeadList,
        AddBusinessLead: AddBusinessLead,
        Clear: Clear,
        DeleteData: DeleteData,
        DeleteRole: DeleteRole
    }
    //#endregion

})();



