var VideoHeader = (function () {
    //#region Ready Function Start Point
    $(document).ready(function () {
        BindHeaderList();
    });
    //#endregion

    //#region Bind Category List
    function BindHeaderList() {
        var Success = function (result) {
            if (result != "" || result.length >= 0) {
                $('#headerlist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'HeaderName' },
                        {
                            data: "Status",
                            render: function (data, type, row) {
                                if (data === "True") { return "Active" }
                                else return "InActive"
                            }
                        },

                        {
                            "data": "HeaderID",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editHeader" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deleteHeader" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/PudhariAdmin/PageAdmin/GetVideoHeaderList/';
        CommonUtility.RequestAjax('POST', url, "", Success, null, null, null);
    }
    //#endregion

    //#region Add New Category
    $('body').on('click', "#btnSubmit", function () {
        var headerName = CommonUtility.ScriptInjection($("#txtHeaderName").val()).replace(/</g, "").replace(/>/g, "");
        var desc = CommonUtility.ScriptInjection($("#txtDesc").val()).replace(/</g, "").replace(/>/g, "");
        var status = CommonUtility.ScriptInjection($("#ddlStatus").val()).replace(/</g, "").replace(/>/g, "");
        var headerID = CommonUtility.ScriptInjection($("#hdnVideoHeaderID").val()).replace(/</g, "").replace(/>/g, "");

        var headerNameStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtHeaderName");

        if (headerNameStatus) {
            if (headerID != "")
                UpdateHeader(headerName, desc, status, headerID)
            else
                AddHeader(headerName, desc, status);
        }
    });

    function AddHeader(headerName, desc, status) {
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                BindHeaderList();
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("Video header saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("Video header exists, could you try another name.");
            }
        }
        var data = {
            HeaderName: headerName,
            Desc: desc,
            Status: status
        };
        var url = '/PudhariAdmin/PageAdmin/AddVideoHeader/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }

    function UpdateHeader(headerName, desc, status, headerID) {
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                CommonUtility.SucessMessagePopUp("Video header updated successfully.");
                BindHeaderList();
            }
        }
        var data = {
            HeaderID: headerID,
            HeaderName: headerName,
            Desc: desc,
            Status: status
        };
        var url = '/PudhariAdmin/PageAdmin/UpdateVideoHeader/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#txtHeaderName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtHeaderName");
    });

    //#endregion

    //#region clear PoliticalParty controls
    $('body').on('click', "#btnClear", function () {
        Clear();
    });

    function Clear() {
        $("#txtHeaderName").val("");
        $("#txtDesc").val("");
        $("#hdnPhotoHeaderID").val("");

        $("#errtxtHeaderName").html("").hide();
    }
    //#endregion

    //#region delete Category
    $('body').on('click', "#deleteHeader", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete video header", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeleteHeader(id);
    });
    function DeleteHeader(HeaderID) {
        var headerID = CommonUtility.ScriptInjection(HeaderID).replace(/</g, "").replace(/>/g, "");
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("Video header deleted successfully.");
                BindHeaderList();
                Clear();
            }
        }
        var data = {
            HeaderID: headerID
        };
        var url = '/PudhariAdmin/PageAdmin/DeleteVideoHeader/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editHeader", function () {
        var headerID = $(this).attr('data-value');
        var BindSuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#txtHeaderName").val(result.HeaderName);
                $("#txtDesc").val(result.Desc);
                $("#ddlStatus").val(result.Status);
                $("#hdnVideoHeaderID").val(result.HeaderID);
            }
        }
        var data = {
            HeaderID: headerID
        };
        var url = '/PudhariAdmin/PageAdmin/GetVideoHeaderByID/';
        CommonUtility.RequestAjax('GET', url, data, BindSuccess, null, null, null);
    });
    //#endregion

    //#region Function return
    return {
        BindHeaderList: BindHeaderList,
        AddHeader: AddHeader,
        Clear: Clear,
        DeleteHeader: DeleteHeader
    }
    //#endregion

})();



