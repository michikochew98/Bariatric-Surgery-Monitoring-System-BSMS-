$(document).ready(function() {
    const body = document.querySelector("body"),
        modeToggle = body.querySelector(".mode-toggle");
    sidebar = body.querySelector("nav");
    sidebarToggle = body.querySelector(".sidebar-toggle");

    let getMode = localStorage.getItem("mode");
    if (getMode && getMode === "dark") {
        body.classList.toggle("dark");
    }

    let getStatus = localStorage.getItem("status");
    if (getStatus && getStatus === "close") {
        sidebar.classList.toggle("close");
    }

    if (modeToggle) {
        modeToggle.addEventListener("click", () => {
            body.classList.toggle("dark");
            if (body.classList.contains("dark")) {
                localStorage.setItem("mode", "dark");
            } else {
                localStorage.setItem("mode", "light");
            }
        });
    }

    if (sidebarToggle) {
        sidebarToggle.addEventListener("click", () => {
            sidebar.classList.toggle("close");
            if (sidebar.classList.contains("close")) {
                localStorage.setItem("status", "close");
            } else {
                localStorage.setItem("status", "open");
            }
        });
    }

    $('#example').DataTable({
        responsive: true,
        searching: false,
        info: true,
        paging: true,
        language: {
            'paginate': {
                'previous': '<span class="prev-icon" style="padding:5px">Previous 	|</span>',
                'next': '<span class="next-icon" style="padding:5px">| 	Next</span>'
            }
        },
        dom: '<"bottom"flp>rt<"bottom"i><"clear">',


        "pageLength": 5
    });




});