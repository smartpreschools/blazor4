var Meeting = (function () {
    //#region Ready Function Start Point
    $(document).ready(function () {
        BindMeetingList();
    });
    //#endregion

    //#region Bind Category List
    function BindMeetingList() {
        var ValiditySuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $('#meetinglist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'Title' },
                        { data: 'Date' },
                        { data: 'StartTime' },
                        { data: 'EndTime' },
                        { data: 'Status' },
                        {
                            "data": "Id",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editMeeting" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deleteMeeting" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/PudhariAdmin/Schedule/GetMeetingList/';
        CommonUtility.RequestAjax('POST', url, "", ValiditySuccess, null, null, null);
    }
    //#endregion

    //#region Add New Category
    $('body').on('click', "#btnSubmit", function () {
        var title = $("#txtTitle").summernote('code');
        var date = CommonUtility.ScriptInjection($("#txtDate").val()).replace(/</g, "").replace(/>/g, "");
        var startTime = CommonUtility.ScriptInjection($("#txtStartTime").val()).replace(/</g, "").replace(/>/g, "");
        var endTime = CommonUtility.ScriptInjection($("#txtEndTime").val()).replace(/</g, "").replace(/>/g, "");
        var desc = $("#txtDesc").summernote('code');
        var status = CommonUtility.ScriptInjection($("#ddlStatus").val()).replace(/</g, "").replace(/>/g, "");
        var meetingId = CommonUtility.ScriptInjection($("#hdnMeetingId").val()).replace(/</g, "").replace(/>/g, "");

        var titleStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtTitle");
        var datetSatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtDate");

        if (titleStatus && datetSatus) {
            if (meetingId != "")
                UpdateMeeting(title, date, startTime, endTime, desc, status, meetingId)
            else
                AddMeeting(title, date, startTime, endTime, desc, status);
        }
    });

    function AddMeeting(title, date, startTime, endTime, desc, status) {
        var ValiditySuccess = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                BindMeetingList();
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("Meeting details saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("Meeting details exists, could you try another name.");
            }
        }
        var data = {
            Title: title,
            Date: date,
            StartTime: startTime,
            EndTime: endTime,
            Description: desc,
            Status: status
        };
        var url = '/PudhariAdmin/Schedule/Meeting/';
        CommonUtility.RequestAjax('POST', url, data, ValiditySuccess, null, null, null);
    }

    function UpdateMeeting(title, date, startTime, endTime, desc, status, meetingId) {
        var ValiditySuccess = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                CommonUtility.SucessMessagePopUp("Meeting details updated successfully.");
                BindMeetingList();
            }
        }
        var data = {
            Id: meetingId,
            Title: title,
            Date: date,
            StartTime: startTime,
            EndTime: endTime,
            Description: desc,
            Status: status
        };
        var url = '/PudhariAdmin/Schedule/UpdateMeeting/';
        CommonUtility.RequestAjax('POST', url, data, ValiditySuccess, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#txtTitle').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtTitle");
    });
    $('#txtDate').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtDate");
    });
    //#endregion

    //#region clear PoliticalParty controls
    $('body').on('click', "#btnClear", function () {
        Clear();
    });

    function Clear() {
        $("#txtDate").val("");
        $("#txtStartTime").val("");
        $("#txtEndTime").val("");
        $("#hdnMeetingId").val("");
        $("#txtDesc").summernote("reset");
        $("#txtTitle").summernote("reset");
        $("#ddlStatus").val("True");

        $("#errtxtTitle").html("").hide();
        $("#errtxtDate").html("").hide();
    }
    //#endregion

    //#region delete Category
    $('body').on('click', "#deleteMeeting", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete Meeting details", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeleteMeeting(id);
    });
    function DeleteMeeting(meetingId) {
        var meetingId = CommonUtility.ScriptInjection(meetingId).replace(/</g, "").replace(/>/g, "");
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("Meeting details Deleted successfully.");
                BindMeetingList();
                Clear();
            }
        }
        var data = {
            id: meetingId
        };
        var url = '/PudhariAdmin/Schedule/DeleteMeeting/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editMeeting", function () {
        var meetingId = $(this).attr('data-value');
        var BindSuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#txtTitle").summernote("code", result.Title);
                $("#txtDate").val(result.Date);
                $("#txtStartTime").val(result.StartTime);
                $("#txtEndTime").val(result.EndTime);
                $("#ddlStatus").val(result.Status);
                $("#txtDesc").summernote("code", result.Description);
                $("#hdnMeetingId").val(result.Id);
            }
        }
        var data = {
            id: meetingId
        };
        var url = '/PudhariAdmin/Schedule/GetMeetingById/';
        CommonUtility.RequestAjax('GET', url, data, BindSuccess, null, null, null);
    });
    //#endregion

    //#region Function return
    return {
        BindMeetingList: BindMeetingList,
        AddMeeting: AddMeeting,
        Clear: Clear,
        DeleteMeeting: DeleteMeeting
    }
    //#endregion

})();
