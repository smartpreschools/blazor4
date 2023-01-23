var Ticket = (function () {
    //#region Ready Function Start Point
    $(document).ready(function () {
        BindDropdown("#ddlTicketPriority", "TicketPriority", "", true);
        BindTicketList();
    });
    //#endregion
    var optionSelect = "<option value='0' selected>Select value.. </option";
   
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

        var url = '/PudhariAdmin/Support/GetActiveTicketPriority/';
        if (isAsync)
            CommonUtility.RequestAjax('GET', url, "", BindDropDownData, null, null, null);
        else
            CommonUtility.RequestAjaxAsync('GET', url, "", BindDropDownData, null, null, null);

    }
   
    //#region Bind Category List
    function BindTicketList() {
        var ValiditySuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $('#ticketlist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'Priority' },
                        { data: 'Title' },
                        { data: 'Status' },
                        {
                            "data": "Id",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editTicket" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deleteTicket" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/PudhariAdmin/Support/GetTicketList/';
        CommonUtility.RequestAjax('POST', url, "", ValiditySuccess, null, null, null);
    }
    //#endregion

    //#region Add New Category
    $('body').on('click', "#btnSubmit", function () {
        var priority = CommonUtility.ScriptInjection($("#ddlTicketPriority").val()).replace(/</g, "").replace(/>/g, "");
        var title = $("#txtTitle").summernote('code');
        var ticketDesc = $("#txtDesc").summernote('code');
        var ticketId = CommonUtility.ScriptInjection($("#hdnTicketId").val()).replace(/</g, "").replace(/>/g, "");
        var status = CommonUtility.ScriptInjection($("#ddlStatus").val()).replace(/</g, "").replace(/>/g, "");
        
        var priorityStatus = CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlTicketPriority");
        var titleStatus = CommonValidation.MandetoryControlValueCheck("TEXTAREA", "txtTitle");
        var descStatus = CommonValidation.MandetoryControlValueCheck("TEXTAREA", "txtDesc");

        if (priorityStatus && titleStatus && descStatus) {
            if (ticketId != "")
                UpdateTicket(priority, title, ticketDesc, ticketId, status)
            else
                AddTicket(priority, title, ticketDesc, ticketDesc, status);
        }
    });

    function AddTicket(priority, title, ticketDesc, ticketDesc, status) {
        var ValiditySuccess = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                BindTicketList();
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("Ticket details saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("Ticket details exists, could you try another name.");
            }
        }
        var data = {
            Priority: priority,
            Title: title,
            Description: ticketDesc,
            Status: status,
        };
        var url = '/PudhariAdmin/Support/Ticket/';
        CommonUtility.RequestAjax('POST', url, data, ValiditySuccess, null, null, null);
    }

    function UpdateTicket(priority, title, ticketDesc, ticketId, status) {
        var ValiditySuccess = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                CommonUtility.SucessMessagePopUp("Ticket details updated successfully.");
                BindTicketList();
            }
        }
        var data = {
            Id: ticketId,
            Priority: priority,
            Title: title,
            Description: ticketDesc,
            status:status
        };
        var url = '/PudhariAdmin/Support/UpdateTicket/';
        CommonUtility.RequestAjax('POST', url, data, ValiditySuccess, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#ddlModule').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlModule");
    });
    $('#ddlPriority').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlPriority");
    });
    //#endregion

    //#region clear PoliticalParty controls
    $('body').on('click', "#btnClear", function () {
        Clear();
    });

    function Clear() {
        $("#ddlTicketPriority").val("0");
      
        $("#hdnTicketId").val("");
        $("#txtDesc").summernote("reset");
        $("#txtTitle").summernote("reset");

        $("#errtxtTitle").html("").hide();
        $("#errtxtDesc").html("").hide();
        $("#errddlPriority").html("").hide();
    }
    //#endregion

    //#region delete Category
    $('body').on('click', "#deleteTicket", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete Ticket details", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeleteTicket(id);
    });
    function DeleteTicket(ticketId) {
        var ticketId = CommonUtility.ScriptInjection(ticketId).replace(/</g, "").replace(/>/g, "");
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("Ticket details deleted successfully.");
                BindTicketList();
                Clear();
            }
        }
        var data = {
            id: ticketId
        };
        var url = '/PudhariAdmin/Support/DeleteTicket/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editTicket", function () {
        var ticketId = $(this).attr('data-value');
        var BindSuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#ddlTicketPriority").val(result.Priority);
                $("#txtTitle").summernote("code", result.Title);
                $("#txtDesc").summernote("code", result.Description);
                $("#hdnTicketId").val(result.Id);
                $("#ddlStatus").val(result.Status);
            }
        }
        var data = {
            id: ticketId
        };
        var url = '/PudhariAdmin/Support/GetTicketById/';
        CommonUtility.RequestAjax('GET', url, data, BindSuccess, null, null, null);
    });
    //#endregion

    //#region Function return
    return {
        BindTicketList: BindTicketList,
        AddTicket: AddTicket,
        Clear: Clear,
        DeleteTicket: DeleteTicket
    }
    //#endregion

})();
