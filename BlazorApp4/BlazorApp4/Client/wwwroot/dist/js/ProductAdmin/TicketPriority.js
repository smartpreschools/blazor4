var Priority = (function () {
    //#region Ready Function Start Point
    $(document).ready(function () {
        BindDropdown("#ddlCategory", "Category", "", true);
        BindPriorityList();
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
    function BindPriorityList() {
        var Success = function (result) {
            if (result != "" || result.length >= 0) {
                $('#prioritylist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'Category' },
                        { data: 'Name' },
                        {
                            data: "Status",
                            render: function (data, type, row) {
                                if (data === "True") { return "Active" }
                                else return "InActive"
                            }
                        },
                        {
                            "data": "Id",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editPriority" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deletePriority" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/ProductAdmin/Master/GetTicketPriorityList/';
        CommonUtility.RequestAjax('POST', url, "", Success, null, null, null);
    }
    //#endregion

    //#region Add New State
    $('body').on('click', "#btnSubmit", function () {
        var category = CommonUtility.ScriptInjection($("#ddlCategory").val()).replace(/</g, "").replace(/>/g, "");
        var name = CommonUtility.ScriptInjection($("#txtName").val()).replace(/</g, "").replace(/>/g, "");
        var desc = CommonUtility.ScriptInjection($("#txtDesc").val()).replace(/</g, "").replace(/>/g, "");
        var id = CommonUtility.ScriptInjection($("#hdnId").val()).replace(/</g, "").replace(/>/g, "");
        var status = CommonUtility.ScriptInjection($("#ddlStatus").val()).replace(/</g, "").replace(/>/g, "");

        var categoryStatus = CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlCategory");
        var nameameStatus = CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtName");


        if (categoryStatus && nameameStatus) {
            if (id != "")
                UpdatePriority(id, category, name, desc, status)
            else
                AddPriority(category, name, desc, status);
        }
    });

    function AddPriority(category, name, desc, status) {

        var Success = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                BindPriorityList();
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("Priority saved successfully.");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("Priority already exists, could you try another name.");
            }
        }
        var data = {
            Category: category,
            Name: name,
            Status: status,
            Description: desc
        };
        var url = '/ProductAdmin/Master/AddTicketPriority/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }

    function UpdatePriority(id, category, name, desc, status) {

        var Success = function (result) {
            if (result != "" || result.length > 0) {
                CommonUtility.SucessMessagePopUp("Website Plan updated successfully.");
                Clear();
                BindPriorityList();
            }
        }
        var data = {
            Id: id,
            Category: category,
            Name: name,
            Status: status,
            Description: desc
        };
        var url = '/ProductAdmin/Master/UpdateTicketPriority/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#ddlCategory').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("DROPDOWN", "ddlCategory")
    });
    
    $('#txtName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtName");
    });
   
    //#region Validation


    //#endregion

    //#region clear State controls
    $('body').on('click', "#btnClear", function () {
        Clear();
    });

    function Clear() {
        $("#txtName").val("");
        $("#ddlCategory").val("0");
        $("#hdnId").val("");
        $("#txtDesc").val("");

        $("#errtxtName").html("").hide();
        $("#errddlCategory").html("").hide();
    }
    //#endregion

    //#region delete Category
    $('body').on('click', "#deletePriority", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete Priority", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeletePriority(id);
    });
    function DeletePriority(id) {
        var id = CommonUtility.ScriptInjection(id).replace(/</g, "").replace(/>/g, "");
        var Success = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("Priority deleted successfully.");
                BindPriorityList();
                Clear();
            }
        }
        var data = {
            id: id
        };
        var url = '/ProductAdmin/Master/DeleteTicketPriority/';
        CommonUtility.RequestAjax('POST', url, data, Success, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editPriority", function () {
        var id = $(this).attr('data-value');
        var Sucess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#ddlCategory").val(result.Category);
                $("#txtName").val(result.Name);
                $("#txtDesc").val(result.Description);
                $("#ddlStatus").val(result.Status);
                $("#hdnId").val(result.Id);
            }
        }
        var data = {
            id: id
        };
        var url = '/ProductAdmin/Master/GetTicketPriorityById/';
        CommonUtility.RequestAjax('GET', url, data, Sucess, null, null, null);
    });
    //#endregion

    //#region Function return
    return {
        BindPriorityList: BindPriorityList,
        AddPriority: AddPriority,
        Clear: Clear,
        DeletePriority: DeletePriority
    }
    //#endregion

})();



