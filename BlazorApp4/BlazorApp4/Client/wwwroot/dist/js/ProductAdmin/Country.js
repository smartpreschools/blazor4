var Country = (function () {

    //#region Ready Function Start Point
    $(document).ready(function () {
        BindCountryList();
    });
    //#endregion

    //#region Bind Country List
    function BindCountryList() {
        var BindCountrySuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $('#countrylist').DataTable({
                    data: result,
                    "bFilter": true,
                    "bLengthChange": true,
                    "bDestroy": true,
                    "lengthMenu": [[5, 10, 25, -1], [5, 10, 25, "All"]],
                    columns: [
                        { data: 'CountryName' },
                        { data: 'CountryDesc' },
                        {
                            data: "Status",
                            render: function (data, type, row) {
                                if (data === "True") { return "Active" }
                                else return "InActive"
                            }
                        },
                        {
                            "data": "CountryID",
                            "searchable": false,
                            "sortable": false,
                            "render": function (data, type, full, meta) {
                                return '<i class="fas fa-edit" id="editCountry" data-value ="' + data + '"></i>|<i class="fas fa-trash-alt" id="deleteCountry" data-value ="' + data + '" ></i>';
                            }
                        }
                    ]
                });
            }
        }

        var url = '/ProductAdmin/Master/GetCountryList/';
        CommonUtility.RequestAjax('POST', url, "", BindCountrySuccess, null, null, null);
    }
    //#endregion

    //#region Add New Country
    $('body').on('click', "#btnSubmit", function () {
        var countryName = CommonUtility.ScriptInjection($("#txtCountryName").val()).replace(/</g, "").replace(/>/g, "");
        var countryDesc = CommonUtility.ScriptInjection($("#txtCountryDesc").val()).replace(/</g, "").replace(/>/g, "");
        var countryID = CommonUtility.ScriptInjection($("#hdnCountryID").val()).replace(/</g, "").replace(/>/g, "");
        var countryStatus = $("#ddlCountryStatus").val();
        if (countryName != "") {
            if (countryID != "")
                UpdateCountry(countryName, countryName, countryStatus, countryID);
            else
                AddCountry(countryName, countryName, countryStatus   );
        }
        else {
            CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtCountryName");
        }
    });

    function AddCountry(countryName, countryDesc, countryStatus) {

        var CountrySuccess = function (result) {
            if (result != "" || result.length > 0) {
                Clear();
                BindCountryList();
                if (result === 1)
                    CommonUtility.SucessMessagePopUp("Country saved successfully..");
                if (result === -1)
                    CommonUtility.SucessMessagePopUp("Country already exists, could you try another name.");
            }
        }
        var data = {
            CountryName: countryName,
            CountryDesc: countryDesc,
            Status: countryStatus
        };
        var url = '/ProductAdmin/Master/Country/';
        CommonUtility.RequestAjax('POST', url, data, CountrySuccess, null, null, null);
    }

    function UpdateCountry(countryName, countryDesc, countryStatus, countryID) {

        var CountrySuccess = function (result) {
            if (result != "" || result.length > 0) {
                CommonUtility.SucessMessagePopUp("Country updated successfully.");
                Clear();
                BindCountryList();
            }
        }
        var data = {
            CountryID: countryID,
            CountryName: countryName,
            CountryDesc: countryDesc,
            Status: countryStatus
        };
        var url = '/ProductAdmin/Master/UpdateCountry/';
        CommonUtility.RequestAjax('POST', url, data, CountrySuccess, null, null, null);
    }
    //#endregion

    //#region Validation
    $('#txtCountryName').on('change', function () {
        CommonValidation.MandetoryControlValueCheck("TEXTBOX", "txtCountryName");
    });
    //#endregion

    //#region clear country controls
    $('body').on('click', "#btnClear", function () {
        Clear();
    });

    function Clear() {
        $("#txtCountryName").val("");
        $("#txtCountryDesc").val("");
        $("#hdnCountryID").val("");

        $("#errtxtCountryName").html("").hide();
    }
    //#endregion

    //#region delete Category
    $('body').on('click', "#deleteCountry", function () {
        var id = $(this).attr('data-value');
        CommonUtility.DeleteWarningMessagePopIp("Are you sure you want to delete Country", id);
    });
    $('body').on('click', "#finaldelete", function () {
        var id = $(this).attr('data-myval')
        DeleteCountry(id);
    });
    function DeleteCountry(CountryID) {
        var countryID = CommonUtility.ScriptInjection(CountryID).replace(/</g, "").replace(/>/g, "");
        var CountrySuccess = function (result) {
            if (result != "" || result.length > 0) {
                $("#modal-delete-danger").modal('hide');
                CommonUtility.SucessMessagePopUp("Country Deleted successfully.");
                BindCountryList();
                Clear();
            }
        }
        var data = {
            CountryID: countryID
        };
        var url = '/ProductAdmin/Master/DeleteCountry/';
        CommonUtility.RequestAjax('POST', url, data, CountrySuccess, null, null, null);
    }
    //#endregion

    //#region Edit Category
    $('body').on('click', "#editCountry", function () {
        var countryID = $(this).attr('data-value');
        var BindCountrySuccess = function (result) {
            if (result != "" || result.length >= 0) {
                $("#txtCountryName").val(result.CountryName);
                $("#txtCountryDesc").val(result.CountryDesc);
                $("#ddlCountryStatus").val(result.Status);
                $("#hdnCountryID").val(result.CountryID);
            }
        }
        var data = {
            CountryID: countryID
        };
        var url = '/ProductAdmin/Master/GetCountryByID/';
        CommonUtility.RequestAjax('GET', url, data, BindCountrySuccess, null, null, null);
    });
    //#endregion

    //#region Function return
    return {
        BindCountryList: BindCountryList,
        AddCountry: AddCountry,
        Clear: Clear,
        DeleteData: DeleteData,
        DeleteCountry: DeleteCountry
    }
    //#endregion

})();
