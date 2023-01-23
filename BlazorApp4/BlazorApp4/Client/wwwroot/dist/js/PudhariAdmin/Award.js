var Award = (function () {
    //#region Ready Function Start Point
    $(document).ready(function () {
        BindAwardList();
    });
    //#endregion

    //#region Bind Category List
    function BindAwardList() {
        var ValiditySuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $('#awardlist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'Name' },
                        { data: 'Description' },
                        { data: 'Status' },
                        {
                            "data": "AwardId",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editAward" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deleteAward" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/PudhariAdmin/Awards/GetAwardList/';
        CommonUtility.RequestAjax('POST', url, "", ValiditySuccess, null, null, null);
    }
    //#endregion

    //#region Add New Category
    $('body').on('click', "#btnSubmit", function () {
        var awardName = CommonUtility.ScriptInjection($("#txtName").val()).replace(/</g, "").replace(/>/g, "");
        var awardDate = CommonUtility.ScriptInjection($("#txtAwardDate").val()).replace(/</g, "").replace(/>/g, "");
        var awardGivenName = CommonUtility.ScriptInjection($("#txtGivenName").val()).replace(/</g, "").replace(/>/g, "");
        var awardDesc = $("#txtDesc").summernote('code');
        var awardStatus = CommonUtility.ScriptInjection($("#ddlStatus").val()).replace(/</g, "").replace(/>/g, "");
        var awardId = CommonUtility.ScriptInjection($("#hdnAwardId").val()).replace(/</g, "").replace(/>/g, "");

        var awardNameStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtName");
        
        if (awardNameStatus) {
            if (awardId != "")
                UpdateAward(awardName, awardDate, awardGivenName,  awardDesc, awardStatus, awardId)
            else
                AddAward(awardName, awardDate, awardGivenName,  awardDesc, awardStatus);
        }
    });

    function AddAward(awardName, awardDate, awardGivenName, awardDesc, awardStatus) {
        var ValiditySuccess = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                BindAwardList();
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("Award details saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("Award details exists, could you try another name.");
            }
        }
        var data = {
            Name: awardName,
            AwardDate: awardDate,
            GivenName: awardGivenName,
            Description: awardDesc,
            Status: awardStatus
        };
        var url = '/PudhariAdmin/Awards/Award/';
        CommonUtility.RequestAjax('POST', url, data, ValiditySuccess, null, null, null);
    }

    function UpdateAward(awardName, awardDate, awardGivenName, awardDesc, awardStatus, awardId) {
        var ValiditySuccess = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                CommonUtility.SucessMessagePopUp("Award details updated successfully.");
                BindAwardList();
            }
        }
        var data = {
            AwardId: awardId,
            Name: awardName,
            AwardDate: awardDate,
            GivenName: awardGivenName,
            Description: awardDesc,
            Status: awardStatus
        };
        var url = '/PudhariAdmin/Awards/UpdateAward/';
        CommonUtility.RequestAjax('POST', url, data, ValiditySuccess, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#txtName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtame");
    });
    
    //#endregion

    //#region clear PoliticalParty controls
    $('body').on('click', "#btnClear", function () {
        Clear();
    });

    function Clear() {
        $("#txtGivenName").val("");
        $("#txtAwardDate").val("");
        $("#txtName").val("");
        $("#hdnAwardId").val("");
        $("#txtDesc").summernote("reset");

        $("#errtxtName").html("").hide();
    }
    //#endregion

    //#region delete Category
    $('body').on('click', "#deleteAward", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete Award details", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeleteAwardrmation(id);
    });
    function DeleteAwardrmation(AwardID) {
        var awardId = CommonUtility.ScriptInjection(AwardID).replace(/</g, "").replace(/>/g, "");
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("Award details Deleted successfully.");
                BindAwardList();
                Clear();
            }
        }
        var data = {
            awardId: awardId
        };
        var url = '/PudhariAdmin/Awards/DeleteAward/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editAward", function () {
        var awardId = $(this).attr('data-value');
        var BindSuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#txtName").val(result.Name);
                $("#txtAwardDate").val(result.AwardDate);
                $("#txtGivenName").val(result.GivenName);
                $("#txtDesc").summernote("code", result.Description);
                $("#hdnAwardId").val(result.AwardId);
            }
        }
        var data = {
            awardId: awardId
        };
        var url = '/PudhariAdmin/Awards/GetAwardById/';
        CommonUtility.RequestAjax('GET', url, data, BindSuccess, null, null, null);
    });
    //#endregion

    //#region Function return
    return {
        BindAwardList: BindAwardList,
        AddAward: AddAward,
        Clear: Clear,
        DeleteAward: DeleteAward
    }
    //#endregion

})();
