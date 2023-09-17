document.addEventListener('DOMContentLoaded', function () {
    var conditionSelect = document.getElementById('conditionSelect');
    var resultContainer = document.getElementById('resultContainer');
    var itemsPerPageInput = document.getElementById('itemsPerPageInput');
    var searchInput = document.getElementById('searchInputdata');
    var disablePaginationButton = document.getElementById('disablePaginationButton');
    var currentPage = 1;
    var itemsPerPage = parseInt(itemsPerPageInput.value);
    var showAll = false;
    var showPagination = true;

    conditionSelect.addEventListener('change', resetAndFetchData);
    searchInput.addEventListener('input', resetAndFetchData);
    itemsPerPageInput.addEventListener('change', resetAndFetchData);
    disablePaginationButton.addEventListener('click', disablePagination);

    function resetAndFetchData() {
        currentPage = 1;
        showAll = false;
        showPagination = true;
        fetchData();
    }

    function disablePagination() {
        showPagination = false;
        showAll = true;
        fetchData();
    }

    function fetchData() {
        var selectedValue = conditionSelect.value;
        fetch('https://script.google.com/macros/s/AKfycbyOcM_EH7rw345aWfpfHU9H0hWN4heJvjQlFYTi5IvuUe_HtuPB6sfEgsBJ67Q-s0OY/exec?selectedValue=' + encodeURIComponent(selectedValue))
            .then(response => response.json())
            .then(data => {
                var startIndex = (currentPage - 1) * itemsPerPage;
                var endIndex = startIndex + (showAll ? data.length : itemsPerPage);
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

                for (var i = startIndex; i < Math.min(endIndex, filteredData.length); i++) {
                    tableHTML += '<tr>';
                    for (var j = 0; j < filteredData[i].length; j++) {
                        tableHTML += '<td>' + filteredData[i][j] + '</td>';
                    }
                    tableHTML += '<td><button type="button" class="btn btn-success-ct add-btn";" data-row="' + i + '">Thêm</button></td>';
                    tableHTML += '</tr>';
                }
                tableHTML += '</table>';
                resultContainer.innerHTML = tableHTML;

                if (showPagination && !showAll) {
                    var totalPages = Math.ceil(filteredData.length / itemsPerPage);
                    var paginationHTML = '<div class="pagination justify-content-end">';

                    var startPage = Math.max(currentPage - 1, 1);
                    var endPage = Math.min(startPage + 2, totalPages);

                    if (currentPage > 1) {
                        paginationHTML += '<button class="btn btn-outline-primary page-btn" data-page="' + 1 + '"><<</button>';
                        paginationHTML += '<button class="btn btn-outline-primary page-btn" data-page="' + (currentPage - 1) + '"><</button>';
                    }

                    for (var pageNum = startPage; pageNum <= endPage; pageNum++) {
                        paginationHTML += '<button class="btn btn-outline-primary page-btn' + (pageNum === currentPage ? ' active' : '') + '" data-page="' + pageNum + '">' + pageNum + '</button>';
                    }

                    if (currentPage < totalPages) {
                        paginationHTML += '<button class="btn btn-outline-primary page-btn" data-page="' + (currentPage + 1) + '">></button>';
                    }

                    paginationHTML += '<button class="btn btn-outline-primary page-btn" data-page="' + totalPages + '">>></button>';
                    paginationHTML += '</div>';
                    resultContainer.innerHTML += paginationHTML;

                    var pageButtons = document.querySelectorAll('.page-btn');
                    pageButtons.forEach(function (button) {
                        button.addEventListener('click', function () {
                            currentPage = parseInt(button.getAttribute('data-page'));
                            fetchData();
                        });
                    });
                }

                var addButtons = document.querySelectorAll('.add-btn'); // Chọn các nút "Thêm"

                addButtons.forEach(function (button) {
                    button.addEventListener('click', function () {
                        var rowIndex = parseInt(button.getAttribute('data-row'));
                        var rowData = data[rowIndex + startIndex]; // Truy xuất dữ liệu từ bảng
                        
                        // Kiểm tra xem rowData có tồn tại và có đủ thông tin hay không
                        if (rowData && rowData.length === 3) { // Chỉ ví dụ, thay 3 bằng số thuộc tính trong rowData của bạn
                            var itemNmInput = document.getElementById("item_nm");
                            var methInput = document.getElementById("meth");
                            
                            if (itemNmInput) {
                                itemNmInput.value = rowData[1]; // Gán giá trị Parameter từ rowData
                                methInput.value = rowData[2]; // Gán giá trị Parameter từ rowData
                            } else {
                                console.error("Element with id 'item_nm' not found.");
                            }
                        } else {
                            console.error("Missing or invalid data in rowData:", rowData);
                        }
                    });
                });
                
                
                


            })
            .catch(error => {
                console.error('Lỗi:', error);
            });
    }

    fetchData();
});