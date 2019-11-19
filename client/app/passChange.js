
const changePassword = (e) => {
    e.preventDefault();

    if ($('#oldpass').val() == '' || $('#pass').val() == '' || $('#pass2').val() == '') {
        handleError("all fields required");
        return false;
    }

    if ($('#pass').val() !== $('#pass2').val()) {
        handleError("passwords arn't the same");
        return false;
    }

    sendAjax('POST', $('#passChange').attr('action'), $('#passChange').serialize(), redirect);

    return false;
};

const PassWindow = (props) => {
    return (
        <form id="passForm" name="passForm"
            onSubmit={changePassword}
            action="/changePass"
            method="POST"
            className="mainForm">
            <label htmlFor="pass">Old Password: </label>
            <input id="oldpass" type="password" name="oldpass" placeholder="password" />
            <label htmlFor="pass">New Password: </label>
            <input id="pass" type="password" name="pass" placeholder="password" />
            <label htmlFor="pass2">New Password: </label>
            <input id="pass2" type="password" name="pass2" placeholder="retype password" />
            <input className="newPass" type="submit" value="Change Pass" />
        </form>
    );
};
const createPassWindow = (csrf) => {
    ReactDOM.render(
        <PassWindow csrf={csrf} />,
        document.querySelector('#content')
    );
};