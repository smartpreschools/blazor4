var Document = (function () {
    //#region Ready Function Start Point
    $(document).ready(function () {
        BindDocumentList();
    });
    //#endregion

    //#region Bind Category List
    function BindDocumentList() {
        var ValiditySuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $('#documentlist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'Name' },
                        { data: 'Url' },
                        { data: 'Status' },
                        {
                            "data": "DocumentId",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editDocument" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deleteDocument" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/PudhariAdmin/Common/GetDocumentList/';
        CommonUtility.RequestAjax('POST', url, "", ValiditySuccess, null, null, null);
    }
    //#endregion

    //#region Add New Category
    $('body').on('click', "#btnSubmit", function () {
        var name = CommonUtility.ScriptInjection($("#txtName").val()).replace(/</g, "").replace(/>/g, "");
        var document = CommonUtility.ScriptInjection($("#txtDocumnet").val()).replace(/</g, "").replace(/>/g, "");
        var desc = $("#txtDesc").summernote('code');
        var status = CommonUtility.ScriptInjection($("#ddlStatus").val()).replace(/</g, "").replace(/>/g, "");
        var documentId = CommonUtility.ScriptInjection($("#hdnDocumentId").val()).replace(/</g, "").replace(/>/g, "");

        var nameStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtName");
        var documentStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtDocument");

        if (nameStatus) {
            if (documentId != "")
                UpdateDocument(name, document, desc, status, documentId)
            else
                AddDocument(name, document, desc, status);
        }
    });

    function AddDocument(name, document, desc, status) {
        var ValiditySuccess = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                BindDocumentList();
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("Document details saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("Document details exists, could you try another name.");
            }
        }
        var data = {
            Name: name,
            Url: document,
            Description: desc,
            Status: status
        };
        var url = '/PudhariAdmin/Common/Document/';
        CommonUtility.RequestAjax('POST', url, data, ValiditySuccess, null, null, null);
    }

    function UpdateDocument(name, document, desc, status, documentId) {
        var ValiditySuccess = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                CommonUtility.SucessMessagePopUp("Document details updated successfully.");
                BindDocumentList();
            }
        }
        var data = {
            DocumentId: documentId,
            Name: name,
            Url: document,
            Description: desc,
            Status: status
        };
        var url = '/PudhariAdmin/Common/UpdateDocument/';
        CommonUtility.RequestAjax('POST', url, data, ValiditySuccess, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#txtName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtame");
    });
    $('#txtDocument').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtDocument");
    });
    //#endregion

    //#region clear PoliticalParty controls
    $('body').on('click', "#btnClear", function () {
        Clear();
    });

    function Clear() {
        $("#txtName").val("");
        $("#txtDocument").val("");
        $("#hdnDocumentId").val("");
        $("#txtDesc").summernote("reset");

        $("#errtxtName").html("").hide();
        $("#errtxtDocument").html("").hide();
    }
    //#endregion

    //#region delete Category
    $('body').on('click', "#deleteDocument", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete Document details", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeleteDocument(id);
    });
    function DeleteDocument(documentId) {
        var documentId = CommonUtility.ScriptInjection(documentId).replace(/</g, "").replace(/>/g, "");
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("Document details Deleted successfully.");
                BindDocumentList();
                Clear();
            }
        }
        var data = {
            documentId: documentId
        };
        var url = '/PudhariAdmin/Common/DeleteDocument/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editDocument", function () {
        var documentId = $(this).attr('data-value');
        var BindSuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#txtName").val(result.Name);
                $("#txtDocument").val(result.Url);
                $("#txtDesc").summernote("code", result.Description);
                $("#hdnDocumentId").val(result.DocumentId);
            }
        }
        var data = {
            documentId: documentId
        };
        var url = '/PudhariAdmin/Common/GetDocumentById/';
        CommonUtility.RequestAjax('GET', url, data, BindSuccess, null, null, null);
    });
    //#endregion

    //#region Function return
    return {
        BindDocumentList: BindDocumentList,
        AddDocument: AddDocument,
        Clear: Clear,
        DeleteDocument: DeleteDocument
    }
    //#endregion

})();
