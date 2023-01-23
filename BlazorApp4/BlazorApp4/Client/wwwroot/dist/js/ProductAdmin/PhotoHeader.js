var PhotoHeader = (function () {

    //#region Ready Function Start Point
    $(document).ready(function () {
        BindDropdown("#ddlCategory", "Category", "", true);
        
        BindPhotoHeaderList();
    });
    //#endregion
    var optionSelect = "<option value='0' selected>Select value.. </option";
    //#region Bind Country List
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
    //#endregion
    //#region Bind State List
    function BindPhotoHeaderList() {
        var Success = function (result) {
            if (result != "" || result.length >= 0) {
                $('#PhotoHeaderlist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'Category' },
                        { data: 'PhotoHeaderName' },
                        
                        {
                            data: "Status",
                            render: function (data, type, row) {
                                if (data === "True") { return "Active" }
                                else return "InActive"
                            }
                        },
                        {
                            "data": "PhotoHeaderID",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editPhotoHeader" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deletePhotoHeader" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/ProductAdmin/WebAdmin/GetPhotoHeaderList/';
        CommonUtility.RequestAjax('POST', url, "", Success, null, null, null);
    }
    //#endregion

    //#region Add New State
    $('body').on('click', "#btnSubmit", function () {
        var category = CommonUtility.ScriptInjection($("#ddlCategory").val()).replace(/</g, "").replace(/>/g, "");      
        var photoHeaderName = CommonUtility.ScriptInjection($("#txtPhotoHeaderName").val()).replace(/</g, "").replace(/>/g, "");
        var photoHeaderStatus = CommonUtility.ScriptInjection($("#ddlPhotoHeaderStatus").val()).replace(/</g, "").replace(/>/g, "");
        var desc = CommonUtility.ScriptInjection($("#txtPhotoHeaderDesc").val()).replace(/</g, "").replace(/>/g, "");
        var photoHeaderID = CommonUtility.ScriptInjection($("#hdnPhotoHeaderID").val()).replace(/</g, "").replace(/>/g, "");

        var categoryStatus = CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlCategory");
       
        var photoHeaderNameStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtPhotoHeaderName");
        
        if (categoryStatus  && photoHeaderNameStatus) {
            if (photoHeaderID != "")
                UpdatePhoto(photoHeaderID, category, photoHeaderName, photoHeaderStatus, desc)
            else
                AddPhoto(category, photoHeaderName, photoHeaderStatus, desc);
        }
    });

    function AddPhoto(category, photoHeaderName,  photoHeaderStatus, desc) {

        var Success = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                BindPhotoHeaderList();
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("Photo saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("Photo already exists, could you try another name.");
            }
        }
        var data = {
            Category: category,          
            PhotoHeaderName: photoHeaderName,           
            Status: photoHeaderStatus,
            PhotoHeaderDesc: desc
        };
        var url = '/ProductAdmin/WebAdmin/AddPhotoHeader/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }

    function UpdatePhoto(photoHeaderID, category, photoHeaderName,  photoHeaderStatus, desc) {

        var Success = function (result) {
            if (result != "" || result.length > 0) {
                CommonUtility.SucessMessagePopUp("Website Photo updated successfully.");
                Clear();
                BindPhotoHeaderList();
            }
        }
        var data = {
            PhotoHeaderID: photoHeaderID,
            Category: category,
            
            PhotoHeaderName: photoHeaderName,
           
            Status: photoHeaderStatus,
            PhotoHeaderDesc: desc
        };
        var url = '/ProductAdmin/WebAdmin/UpdatePhotoHeader/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#ddlCategory').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlCategory")
    });
    
    $('#txtPhotoHeaderName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtPhotoHeaderName");
    });
    
    //#region Validation


    //#endregion

    //#region clear State controls
    $('body').on('click', "#btnClear", function () {
        Clear();
    });

    function Clear() {
        $("#txtPhotoHeaderName").val("");
       
        $("#ddlCategory").val("0");
        
        $("#hdnPhotoHeaderID").val("");
        $("#txtPhotoHeaderDesc").val("");

        $("#errtxtPhotoHeaderName").html("").hide();
        $("#errddlCategory").html("").hide();
       
    }
    //#endregion

    //#region delete Category
    $('body').on('click', "#deletePhotoHeader", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete Photo", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeletePhoto(id);
    });
    function DeletePhoto(PhotoHeaderID) {
        var photoHeaderID = CommonUtility.ScriptInjection(PhotoHeaderID).replace(/</g, "").replace(/>/g, "");
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("Photo Deleted successfully.");
                BindPhotoHeaderList();
                Clear();
            }
        }
        var data = {
            PhotoHeaderID: photoHeaderID
        };
        var url = '/ProductAdmin/WebAdmin/DeletePhotoHeader/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editPhotoHeader", function () {
        var photoHeaderID = $(this).attr('data-value');
        var Sucess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#ddlCategory").val(result.Category);             
                $("#txtPhotoHeaderName").val(result.PhotoHeaderName);              
                $("#txtPhotoHeaderDesc").val(result.PhotoHeaderDesc);
                $("#ddlPhotoHeaderStatus").val(result.Status);
                $("#hdnPhotoHeaderID").val(result.PhotoHeaderID);
            }
        }
        var data = {
            PhotoHeaderID: photoHeaderID
        };
        var url = '/ProductAdmin/WebAdmin/GetPhotoHeaderByID/';
        CommonUtility.RequestAjax('GET', url, data, Sucess, null, null, null);
    });
    //#endregion

    //#region Function return
    return {
        BindPhotoHeaderList: BindPhotoHeaderList,
        AddPhotoHeader: AddPhotoHeader,
        Clear: Clear,
        DeleteData: DeleteData,
        DeletePhotoHeader: DeletePhotoHeader
    }
    //#endregion

})();