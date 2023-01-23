var PersonalInfo = (function () {

    //#region Ready Function Start Point
    $(document).ready(function () {
        BindPersonalInfoList();
    });
    //#endregion

    //#region Bind Category List
    function BindPersonalInfoList() {
        var ValiditySuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $('#personalInfolist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'FirstName' },
                        { data: 'LastName' },
                        { data: 'Email' },
                        { data: 'Mobile' },
                        { data: 'Address' },
                        
                        {
                            "data": "InfoID",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editPersonalInfo" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deletePersonalInfo" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/PudhariAdmin/Personal/GetPersonalInfoList/';
        CommonUtility.RequestAjax('POST', url, "", ValiditySuccess, null, null, null);
    }
    //#endregion

    //#region Add New Category
    $('body').on('click', "#btnSubmit", function () {
        var firstName = CommonUtility.ScriptInjection($("#txtFirstName").val()).replace(/</g, "").replace(/>/g, "");
        var middleName = CommonUtility.ScriptInjection($("#txtMiddleName").val()).replace(/</g, "").replace(/>/g, "");
        var lastName = CommonUtility.ScriptInjection($("#txtLastName").val()).replace(/</g, "").replace(/>/g, "");
        var email = CommonUtility.ScriptInjection($("#txtEmail").val()).replace(/</g, "").replace(/>/g, "");
        var mobile = CommonUtility.ScriptInjection($("#txtMobile").val()).replace(/</g, "").replace(/>/g, "");
        var dob = CommonUtility.ScriptInjection($("#txtDOB").val()).replace(/</g, "").replace(/>/g, "");
        var gender = CommonUtility.ScriptInjection($("#ddlGender").val()).replace(/</g, "").replace(/>/g, "");
        var address = CommonUtility.ScriptInjection($("#txtAddress").val()).replace(/</g, "").replace(/>/g, "");
        var description = CommonUtility.ScriptInjection($("#txtDesc").val()).replace(/</g, "").replace(/>/g, "");
        var status = CommonUtility.ScriptInjection($("#ddlStatus").val()).replace(/</g, "").replace(/>/g, "");
        var infoID = CommonUtility.ScriptInjection($("#hdnInfoID").val()).replace(/</g, "").replace(/>/g, "");

        var firstNameStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtFirstName");
        var middleNameStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtMiddleName");
        var lastNameStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtLastName");
        var emailStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtEmail");
        var mobileStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtMobile");
        var genderStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "ddlGender");
        var dobStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtDOB");
        var addressStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtAddress");


        if (firstNameStatus && middleNameStatus && lastNameStatus && emailStatus && mobileStatus && genderStatus && addressStatus && dobStatus) {
            if (infoID != "")
                UpdatePersonalInfo(firstName, middleName, lastName, email, mobile, dob, gender, address, description, status,infoID)
            else
                AddPersonalInfo(firstName, middleName, lastName, email, mobile, dob, gender, address, description, status);
        }
    });

    function AddPersonalInfo(firstName, middleName, lastName, email, mobile, dob, gender, address, description, status) {
        var ValiditySuccess = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                BindPersonalInfoList();
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("Personal information saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("Personal information exists, could you try another name.");
            }
        }
        var data = {
            FirstName: firstName,
            MiddleName : middleName,
            LastName: lastName,
            Email: email,
            Mobile: mobile,
            Address: address,
            DOB: dob,
            Gender:gender,
            Description: description,
            Status: status
        };
        var url = '/PudhariAdmin/Personal/AddPersonalInformation/';
        CommonUtility.RequestAjax('POST', url, data, ValiditySuccess, null, null, null);
    }

    function UpdatePersonalInfo(firstName, middleName, lastName, email, mobile, dob, gender, address, description, status, infoID) {
        var ValiditySuccess = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                CommonUtility.SucessMessagePopUp("Personal information updated successfully.");
                BindPersonalInfoList();
            }
        }
        var data = {
            InfoID: infoID,
            FirstName: firstName,
            MiddleName: middleName,
            LastName: lastName,
            Email: email,
            Mobile: mobile,
            Address: address,
            DOB: dob,
            Gender: gender,
            Description: description,
            Status: status
        };
        var url = '/PudhariAdmin/Personal/UpdatePersonalInformation/';
        CommonUtility.RequestAjax('POST', url, data, ValiditySuccess, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#txtFirstName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtFirstName");
    });
    $('#txtMiddleName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtMiddleName");
    });
    $('#txtLastName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtLastName");
    });
    $('#txtEmail').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtEmail");
    });
    $('#txtMobile').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtMobile");
    });
    $('#txtAddress').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtAddress");
    });
    $('#txtDOB').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtDOB");
    });
    $('#ddlGender').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlGender");
    });
   
    //#endregion

    //#region clear PoliticalParty controls
    $('body').on('click', "#btnClear", function () {
        Clear();
    });

    function Clear() {
        $("#ddlGender").val("");
        $("#txtDOB").val("");
        $("#txtAddress").val("");
        $("#txtMobile").val("");
        $("#txtEmail").val("");
        $("#txtLastName").val("");
        $("#txtMiddleName").val("");
        $("#txtFirstName").val("");
        $("#txtDesc").val("");
        $("#hdnInfoID").val("");
      

        $("#errtxtFirstName").html("").hide();
        $("#errtxtMiddleName").html("").hide();
        $("#errtxtLastName").html("").hide();
        $("#errtxtEmail").html("").hide();
        $("#errtxtMobile").html("").hide();
        $("#errtxtAddress").html("").hide();
        $("#errtxtDOB").html("").hide();
        $("#errddlGender").html("").hide();
    }
    //#endregion

    //#region delete Category
    $('body').on('click', "#deletePersonalInfo", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete personal information", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeletePersonalInformation(id);
    });
    function DeletePersonalInformation(InfoID) {
        var infoID = CommonUtility.ScriptInjection(InfoID).replace(/</g, "").replace(/>/g, "");
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("Personal information Deleted successfully.");
                BindPersonalInfoList();
                Clear();
            }
        }
        var data = {
            InfoID: infoID
        };
        var url = '/PudhariAdmin/Personal/DeletePersonalInfo/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editPersonalInfo", function () {
        var infoID = $(this).attr('data-value');
        var BindSuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#txtFirstName").val(result.FirstName);
                $("#txtMiddleName").val(result.MiddleName);
                $("#txtLastName").val(result.LastName);
                $("#txtEmail").val(result.Email);
                $("#txtMobile").val(result.Mobile);
                $("#txtAddress").val(result.Address);
                $("#txtDOB").val(result.DOB);
                $("#ddlGender").val(result.Gender);
                $("#txtDesc").val(result.Description);
                $("#hdnInfoID").val(result.InfoID);
            }
        }
        var data = {
            InfoID: infoID
        };
        var url = '/PudhariAdmin/Personal/GetInfoByID/';
        CommonUtility.RequestAjax('GET', url, data, BindSuccess, null, null, null);
    });
    //#endregion

    //#region Function return
    return {
        BindPersonalInfoList: BindPersonalInfoList,
        AddPersonalInfo: AddPersonalInfo,
        Clear: Clear,
        DeletePersonalInformation: DeletePersonalInformation
    }
    //#endregion

})();



