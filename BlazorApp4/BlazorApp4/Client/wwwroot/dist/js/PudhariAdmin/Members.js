var Member = (function () {
    //#region Ready Function Start Point
    $(document).ready(function () {
        BindMemberList();
    });
    //#endregion

    //#region Bind Category List
    function BindMemberList() {
        var ValiditySuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $('#memberlist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'FirstName' },
                        { data: 'Mobile' },
                        { data: 'Status' },
                        {
                            "data": "MemberId",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editMember" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deleteMember" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/PudhariAdmin/Common/GetMemberList/';
        CommonUtility.RequestAjax('POST', url, "", ValiditySuccess, null, null, null);
    }
    //#endregion

    //#region Add New Category
    $('body').on('click', "#btnSubmit", function () {
        var firstName = CommonUtility.ScriptInjection($("#txtFirstName").val()).replace(/</g, "").replace(/>/g, "");
        var middleName = CommonUtility.ScriptInjection($("#txtMiddleName").val()).replace(/</g, "").replace(/>/g, "");
        var lastName = CommonUtility.ScriptInjection($("#txtLastName").val()).replace(/</g, "").replace(/>/g, "");
        var mobile = CommonUtility.ScriptInjection($("#txtMobile").val()).replace(/</g, "").replace(/>/g, "");
        var country = CommonUtility.ScriptInjection($("#txtCountry").val()).replace(/</g, "").replace(/>/g, "");
        var state = CommonUtility.ScriptInjection($("#txtState").val()).replace(/</g, "").replace(/>/g, "");
        var district = CommonUtility.ScriptInjection($("#txtDistrict").val()).replace(/</g, "").replace(/>/g, "");
        var taluka = CommonUtility.ScriptInjection($("#txtTaluka").val()).replace(/</g, "").replace(/>/g, "");
        var city = CommonUtility.ScriptInjection($("#txtCity").val()).replace(/</g, "").replace(/>/g, "");
        var desc = CommonUtility.ScriptInjection($("#txtDesc").val()).replace(/</g, "").replace(/>/g, "");
        var status = CommonUtility.ScriptInjection($("#ddlStatus").val()).replace(/</g, "").replace(/>/g, "");
        var memberId = CommonUtility.ScriptInjection($("#hdnMemberId").val()).replace(/</g, "").replace(/>/g, "");


        var firstNameStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtFirstName");
        var lastNameStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtLastName");
        var mobileStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtMobile");

        if (firstNameStatus && lastNameStatus && mobileStatus) {
            if (memberId != "")
                UpdateMember(firstName, middleName, lastName, mobile, country, state, district, taluka, city, desc, status, memberId)
            else
                AddMember(firstName, middleName, lastName, mobile, country, state, district, taluka, city, desc, status);
        }
    });

    function AddMember(firstName, middleName, lastName, mobile, country, state, district, taluka, city, desc, status) {
        var ValiditySuccess = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                BindMemberList();
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("Member details saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("Member details exists, could you try another name.");
            }
        }
        var data = {
            FirstName: firstName,
            MiddleName: middleName,
            LastName: lastName,
            Mobile: mobile,
            Country: country,
            State: state,
            District: district,
            Taluka: taluka,
            City: city,
            Description: desc,
            Status: status
        };
        var url = '/PudhariAdmin/Common/Member/';
        CommonUtility.RequestAjax('POST', url, data, ValiditySuccess, null, null, null);
    }

    function UpdateMember(firstName, middleName, lastName, mobile, country, state, district, taluka, city, desc, status, memberId) {
        var ValiditySuccess = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                CommonUtility.SucessMessagePopUp("Member details updated successfully.");
                BindMemberList();
            }
        }
        var data = {
            MemberId: memberId,
            FirstName: firstName,
            MiddleName: middleName,
            LastName: lastName,
            Mobile: mobile,
            Country: country,
            State: state,
            District: district,
            Taluka: taluka,
            City: city,
            Description: desc,
            Status: status
        };
        var url = '/PudhariAdmin/Common/UpdateMember/';
        CommonUtility.RequestAjax('POST', url, data, ValiditySuccess, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#txtFirstName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtFirstName");
    });
    $('#txtLastName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtLastName");
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
        $("#txtFirstName").val("");
        $("#txtMiddleName").val("");
        $("#txtLastName").val("");
        $("#txtMobile").val("");
        $("#txtCountry").val("");
        $("#txtState").val("");
        $("#txtDistrict").val("");
        $("#txtTaluka").val("");
        $("#txtCity").val("");
        $("#hdnMemberId").val("");
        $("#txtDesc").val("");

        $("#ddlStatus").val("True");

        $("#errtxtFirstName").html("").hide();
        $("#errtxtLastName").html("").hide();
        $("#errtxtMobile").html("").hide();
    }
    //#endregion

    //#region delete Category
    $('body').on('click', "#deleteMember", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete member details", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeleteMember(id);
    });
    function DeleteMember(memberId) {
        var memberId = CommonUtility.ScriptInjection(memberId).replace(/</g, "").replace(/>/g, "");
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("Member details deleted successfully.");
                BindMemberList();
                Clear();
            }
        }
        var data = {
            memberId: memberId
        };
        var url = '/PudhariAdmin/Common/DeleteMember/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editMember", function () {
        var memberId = $(this).attr('data-value');
        var BindSuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#txtFirstName").val(result.FirstName);
                $("#txtMiddleName").val(result.MiddleName);
                $("#txtLastName").val(result.LastName);
                $("#txtMobile").val(result.Mobile);
                $("#txtCountry").val(result.Country);
                $("#txtState").val(result.State);
                $("#txtDistrict").val(result.District);
                $("#txtTaluka").val(result.Taluka);
                $("#txtCity").val(result.City);
                $("#txtDesc").val(result.Description);
                $("#ddlStatus").val(result.Status);
                $("#hdnMemberId").val(result.MemberId);
            }
        }
        var data = {
            memberId: memberId
        };
        var url = '/PudhariAdmin/Common/GetMemberById/';
        CommonUtility.RequestAjax('GET', url, data, BindSuccess, null, null, null);
    });
    //#endregion

    //#region Function return
    return {
        BindMemberList: BindMemberList,
        AddMember: AddMember,
        Clear: Clear,
        DeleteMember: DeleteMember
    }
    //#endregion

})();
