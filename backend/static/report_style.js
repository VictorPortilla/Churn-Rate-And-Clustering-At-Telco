$(document).ready(function() {
    $('tr:nth-child(n+2):not(:last-child)').addClass('hidden');
}
);
$('button').on('click', function() {
    $('tr:nth-child(n+2):not(:last-child)').toggleClass('hidden');
});