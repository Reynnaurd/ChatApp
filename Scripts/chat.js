﻿////////////////////////////////////////////////

function showChatList() {
    document.getElementById('side-1').classList.remove('d-none', 'd-md-block');
    document.getElementById('side-2').classList.add('d-none');
}

function hideChatList() {
    document.getElementById('side-1').classList.add('d-none', 'd-md-block');
    document.getElementById('side-2').classList.remove('d-none');
}

////////////////////////////////////////////////////////////////////////
//////////////////////////