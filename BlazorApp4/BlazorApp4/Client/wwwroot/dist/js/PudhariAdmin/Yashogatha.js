var Yashogatha = (function () {
    //#region Ready Function Start Point
    $(document).ready(function () {
        BindYashogathaList();
    });
    //#endregion

    //#region Bind Category List
    function BindYashogathaList() {
        var Success = function (result) {
            if (result != "" || result.length >= 0) {
                $('#yashogathalist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'Name' },
                        { data: 'Content' },
                        {
                            data: "Status",
                            render: function (data, type, row) {
                                if (data === "True") { return "Active" }
                                else return "InActive"
                            }
                        },

                        {
                            "data": "YashogathaID",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editYashogatha" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deleteYashogatha" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/PudhariAdmin/Personal/GetYashogathaList/';
        CommonUtility.RequestAjax('POST', url, "", Success, null, null, null);
    }
    //#endregion

    //#region Add New Category
    $('body').on('click', "#btnSubmit", function () {
        var name = CommonUtility.ScriptInjection($("#txtName").val()).replace(/</g, "").replace(/>/g, "");
        var content = $("#txtContent").summernote('code');
        var status = CommonUtility.ScriptInjection($("#ddlStatus").val()).replace(/</g, "").replace(/>/g, "");
        var yashogathaID = CommonUtility.ScriptInjection($("#hdnYashogathaID").val()).replace(/</g, "").replace(/>/g, "");

        var nameStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtName");
        var contentStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtContent");

        

        if (nameStatus && contentStatus) {
            if (yashogathaID != "")
                UpdateYashogatha(name, content, status,yashogathaID)
            else
                AddYashogatha(name, content, status);
        }
    });

    function AddYashogatha(name, content, status) {
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                BindYashogathaList();
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("Yashogatha details saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("Yashogatha details exists, could you try another name.");
            }
        }
        var data = {
            Name: name,
            Content: content,
            Status: status
        };
        var url = '/PudhariAdmin/Personal/AddYashogatha/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }

    function UpdateYashogatha(name, content, status, yashogathaID) {
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                CommonUtility.SucessMessagePopUp("Yashogatha updated successfully.");
                BindYashogathaList();
            }
        }
        var data = {
            YashogathaID: yashogathaID,
            Name: name,
            Content: content,
            Status: status
        };
        var url = '/PudhariAdmin/Personal/UpdateYashogatha/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#txtName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtName");
    });
    $('#txtContent').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtContent");
    });

    //#endregion

    //#region clear PoliticalParty controls
    $('body').on('click', "#btnClear", function () {
        Clear();
    });

    function Clear() {
        $("#txtName").val("");
        $("#txtContent").summernote("reset");
        $("#hdnYashogathaID").val("");

        $("#errtxtName").html("").hide();
        $("#errtxtContent").html("").hide();
    }
    //#endregion

    //#region delete Category
    $('body').on('click', "#deleteYashogatha", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete yashogatha detail", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeleteYashogatha(id);
    });
    function DeleteYashogatha(YashogathaID) {
        var yashogathaID = CommonUtility.ScriptInjection(YashogathaID).replace(/</g, "").replace(/>/g, "");
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("Yashogatha detail deleted successfully.");
                BindYashogathaList();
                Clear();
            }
        }
        var data = {
            YashogathaID: yashogathaID
        };
        var url = '/PudhariAdmin/Personal/DeleteYashogatha/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editYashogatha", function () {
        var yashogathaID = $(this).attr('data-value');
        var BindSuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#txtName").val(result.Name);
                $("#txtContent").summernote("code", result.Content);
                $("#ddlStatus").val(result.Status);
                $("#hdnYashogathaID").val(result.YashogathaID);
            }
        }
        var data = {
            YashogathaID: yashogathaID
        };
        var url = '/PudhariAdmin/Personal/GetYashogathaByID/';
        CommonUtility.RequestAjax('GET', url, data, BindSuccess, null, null, null);
    });
    //#endregion

    //#region Function return
    return {
        BindYashogathaList: BindYashogathaList,
        AddYashogatha: AddYashogatha,
        Clear: Clear,
        DeleteYashogatha : DeleteYashogatha
    }
    //#endregion

})();



