var AppsScriptLink = "AKfycbz_d5jSPFHljYFjdjH8YMAyXvwbKGEqzu5wVCvRCjdaNhxW12_eSkCjB1Chxh-KKzgu";
$(document).ready(function () {
    FillDataList();
    SetCurrentDate();
    //Search();
    FormValidation();
    MaxInv();
    //BtnAdd();
    fetchData();


    window.location.href

});

function FillDataList() {
    $.getJSON("https://script.google.com/macros/s/" + AppsScriptLink + "/exec?page=dropdown",
        function (data) {
            var Options = "";
            $.each(data, function (key, value) {
                Options += '<option value="' + value + '">';
            });
            $("#mylist1").html(Options); // Use .html() to set the options in the datalist
        });
}

function GetRate(v) {
    var index = $(v).parent().parent().index();
    var Item = $(v).val();
    $.getJSON("https://script.google.com/macros/s/" + AppsScriptLink + "/exec?page=getrate&no=" + Item,
        function (data) {
            console.log("Received data:", data);

            document.getElementsByName("meth")[index].value = data;

        });
}


function openHtmlDialog() {
    var htmlOutput = HtmlService.createHtmlOutputFromFile('your_html_file_name')
        .setWidth(400)
        .setHeight(200);
    SpreadsheetApp.getUi().showModalDialog(htmlOutput, 'Max Value');
}



function GetPrint() {
    window.print();
}

function BtnAddWithSpecificNumber(number) {
    var v = $("#TRow").clone().appendTo("#TBody");
    $(v).find("input").val('');
    $(v).removeClass("d-none");
    $(v).find("th").first().html($('#TBody tr').length - 1);
    $(v).find("input[name='number']").val(number);
    $(v).find("input[name='rate']").on('change', function () {
        Calc(this);
    });
}

function AddRowWithEnteredNumber() {
    var enteredNumber = parseInt(document.getElementById("inputNumber").value);
    if (!isNaN(enteredNumber)) {
        for (var i = 0; i < enteredNumber; i++) {
            BtnAddWithSpecificNumber(i + 1);
        }
    } else {
        alert("Please enter a valid number.");
    }
}


function clearTable() {

    //addNewRow();
    $("#TBody tr").slice(2).remove();
    
   ReGenSrNo();
}

function BtnAdd() {
    var v = $("#TRow").clone().appendTo('#TBody'); // Tạo bản sao của hàng có ID là "TRow"
    $(v).find("input").val('');
    
    // Loại bỏ lớp d-none từ tất cả các hàng trong bảng
   $(v).removeClass('d-none');




    ReGenSrNo();
}

// Function to add a new row to the table
function addNewRow() {
    var newRow = $("#TRow").clone(); // Clone the template row

    // Update the serial number (assuming it's the first cell in the row)
    var serialNumber = parseInt($("#myTable tr:not(:first)").last().find('th').text()) + 1;
    newRow.find('th').text(serialNumber);

    // Clear input fields in the cloned row (if needed)
    newRow.find('input').val('');

    // Append the new row to the table
    $("#myTable tbody").append(newRow);
}

$("#clearButton").on("click", function() {
    addNewRow();
});



function BtnDel(v) {

    $(v).parent().parent().remove();
   // ReGenSrNo();
    GetTotal();
    ReGenSrNo();
}

function ReGenSrNo() {
    $("#TBody tr").each(function (index) {
        $(this).find("th").first().html(index);
    });
}


function Calc(v) {
    /*Detail Calculation Each Row*/
    var index = $(v).parent().parent().index();
    var qty = 1; // Giả sử số lượng luôn là 1
    var rate = $(v).closest('tr').find("input[name='rate']").val(); // Lấy giá trị rate

    var amt = rate * qty; // Tính toán số tiền
    $(v).closest('tr').find("input[name='amt']").val(amt);

    GetTotal();
}

function GetTotal() {
    //Footer Calculation
    var sum = 0;
    var amts = document.getElementsByName("rate");

    for (let index = 0; index < amts.length; index++) {
        var rate = amts[index].value;
        sum = +(sum) + +(rate);
    }

    document.getElementById("FTotal").value = sum;

    var gst = document.getElementById("FTax").value;
    // Check if gst is not 0 before performing the division
    if (gst !== "0") {
        var net = (sum / parseFloat(gst)) + sum;
        document.getElementById("FTac").value = net;
    }

}

function FormValidation() {
    const forms = document.querySelectorAll('.needs-validation');

    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });
}

function SetCurrentDate() {
    const date = new Date();
    let d = date.getDate();
    let m = date.getMonth() + 1;
    let y = date.getFullYear();

    d = (d < 10) ? '0' + d : d;
    m = (m < 10) ? '0' + m : m;

    let formattedDate = y + '-' + m + '-' + d;
    document.getElementById("iss_dt").value = formattedDate;
    document.getElementById("re_dt").value = formattedDate;
}

function Search(pNo = "") {
    clearTable();
    var no = $('#samp_id').val();

    if (pNo !== "") no = pNo;

    $.getJSON("https://script.google.com/macros/s/" + AppsScriptLink + "/exec?page=search&no=" + no,
        function (data) {
            if (data === "NOT FOUND") {
                alert('Sample No. Not Found...');
            } else {
                var record = data.record;
                var StartRow = data.SR;
                var RowCount = data.CNT;
               
                $('#IsNew').val('N');
                $('#StartRow').val(StartRow);
                $('#RowCount').val(RowCount);

                $.each(record, function (i, value) {
                    if (i === 0) {
                        document.getElementsByName("inv_no")[0].value = value[0];
                        document.getElementsByName("samp_id")[0].value = value[1];
                        document.getElementsByName("re_dt")[0].value = value[6].substring(0, 10);
                        document.getElementsByName("iss_dt")[0].value = value[7].substring(0, 10);
                        document.getElementsByName("cust_nm")[0].value = value[5];
                        document.getElementsByName("cust_no")[0].value = value[4];
                        document.getElementsByName("samp_nm")[0].value = value[2];
                        document.getElementsByName("samp_des")[0].value = value[3];
                        document.getElementsByName("matr")[0].value = value[8];
                    } else {
                        if (i >1 ) BtnAdd();
                        document.getElementsByName("item_nm")[i].value = value[9];
                        document.getElementsByName("meth")[i].value = value[10];
                        document.getElementsByName("rate")[i].value = value[11];
                    }
                });
                console.log(record);
                console.log(StartRow);
             
                console.log(RowCount);
               
                GetTotal();
               // ReGenSrNo();

            }
        });
    $('#exampleModal').modal('hide');
}

function ShowAllData() {
    $.getJSON("https://script.google.com/macros/s/" + AppsScriptLink + "/exec?page=all",
        function (data) {
            var Table = "", Rows = "", Columns = "";
            $.each(data, function (key, value) {
                var InvNo = "";
                Columns = "";
                i = 0;
                $.each(value, function (key1, value1) {
                    i++;
                    if (i === 2) {
                        value1 = "" + value1;
                        value1 = value1.substring(0, 10);
                    }
                    Columns += '<td>' + value1 + '</td>';
                    if (InvNo === "") InvNo = value1;
                });
                Rows += '<tr onclick="Search(' + InvNo + ')">' + Columns + '</tr>';
            });
            $("#MyTBody").html(Rows);
            $('#exampleModal').modal('show');
        });
}


function MaxInv() {

    $.getJSON("https://script.google.com/macros/s/" + AppsScriptLink + "/exec?page=max",
        function (data) {
            $("input[name='inv_no']").val(data);
        });
}

function updateInputValue(maxValue) {
    var inputElement = document.getElementById("samp_id");
    if (inputElement) {
        inputElement.value = maxValue;
    } else {
        console.error("Error: Input element not found.");
    }
}

//bang chi tieu
var conditionSelect = document.getElementById('conditionSelect');
var resultContainer = document.getElementById('resultContainer');
var searchInput = document.getElementById('searchInputdata');
var data = [];

conditionSelect.addEventListener('change', fetchData);
searchInput.addEventListener('input', fetchData);

function fetchData() {
    var selectedValue = conditionSelect.value;
    fetch('https://script.google.com/macros/s/AKfycbyOcM_EH7rw345aWfpfHU9H0hWN4heJvjQlFYTi5IvuUe_HtuPB6sfEgsBJ67Q-s0OY/exec?selectedValue=' + encodeURIComponent(selectedValue))
        .then(response => response.json())
        .then(fetchedData => {
            data = fetchedData;
            displayTable(data);
        })
        .catch(error => {

        });
}

document.addEventListener('DOMContentLoaded', function () {
    var conditionSelect = document.getElementById('conditionSelect');
    var resultContainer = document.getElementById('resultContainer');
    var searchInput = document.getElementById('searchInputdata');
    var data = [];

    conditionSelect.addEventListener('change', fetchData);
    searchInput.addEventListener('input', fetchData);

    function fetchData() {
        var selectedValue = conditionSelect.value;
        fetch('https://script.google.com/macros/s/AKfycbyOcM_EH7rw345aWfpfHU9H0hWN4heJvjQlFYTi5IvuUe_HtuPB6sfEgsBJ67Q-s0OY/exec?selectedValue=' + encodeURIComponent(selectedValue))
            .then(response => response.json())
            .then(fetchedData => {
                data = fetchedData;
                displayTable(data);
            })
            .catch(error => {
                console.error('Lỗi:', error);
            });
    }

    function displayTable(data) {
        var tableHTML = '<table class="table table-bordered" id="sourceTable" style="font-size:12px;">';
        var headerRow = data.shift();

        tableHTML += '<thead><tr>';
        for (var h = 0; h < headerRow.length; h++) {
            tableHTML += '<th>' + headerRow[h] + '</th>';
        }
        tableHTML += '</tr></thead>';

        var searchValue = searchInput.value.trim().toLowerCase();
        var filteredData = data.filter(function (row) {
            return row.some(function (cell) {
                return cell.toLowerCase().includes(searchValue);
            });
        });

        for (var i = 0; i < filteredData.length; i++) {
            tableHTML += '<tr>';
            for (var j = 0; j < filteredData[i].length; j++) {
                tableHTML += '<td>' + filteredData[i][j] + '</td>';
            }
            tableHTML += '<td><button type="button" class="btn btn-success-ct add-btn" data-row="' + i + '">Thêm</button></td>';

            tableHTML += '</tr>';
        }
        tableHTML += '</table>';
        resultContainer.innerHTML = tableHTML;
             
        var addButtons = document.querySelectorAll('.add-btn');
addButtons.forEach(function (addButton, index) {
  addButton.addEventListener('click', function () {
    rowIndex = index; // Cập nhật rowIndex với hàng hiện đang được chọn
    console.log(rowIndex);
    var selectedData = filteredData[rowIndex];
    console.log(selectedData);
    document.getElementById('item_nm').value = selectedData[1];
    document.getElementById('meth').value = selectedData[2];
  
    
  });
});




    }
        
});

