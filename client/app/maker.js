const handleDomo = (e) => {
    e.preventDefault();

    $('#domoMessage').animate({ width: 'hide' }, 350);

    if ($('#domoTweet').val() == '') {
        handleError('come on theres only one requirement');
        return false;
    }

    sendAjax('POST', $('#domoForm').attr('action'), $('#domoForm').serialize(), function () {
        loadDomosFromServer();
    });

    return false;
}

const DomoForm = (props) => {
    return (
        <form id="domoForm"
            onSubmit={handleDomo}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm">
            <label htmlFor="tweet"></label>
            <textarea rows="4" cols="50" type="text" id="domoTweet" name="tweet"></textarea>

            <input type="hidden" name="_csrf" value={props.csrf} />
            <input className="makeDomoSubmit" type="submit" value="Tweet" />
        </form>
    );
};

const DomoList = function (props) {
    if (props.domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Tweets Exist</h3>
            </div>
        )
    }

    const domoNodes = props.domos.map(function (domo) {
        return (
            <div className="domo">
                <h3 className="domoTweet">{domo.username}: {domo.tweet}</h3>
            </div>
        );
    });

    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

const loadDomosFromServer = () => {
    sendAjax('GET', '/getDomos', null, (data) => {
        ReactDOM.render(
            <DomoList domos={data.domos} username={data.username}/>, document.querySelector('#domos')
        );
    });
};

const setup = function(csrf) {
    document.querySelector("#passChange").addEventListener("click", (e) => {
        e.preventDefault();
        ReactDOM.render(
            <PassWindow csrf={csrf} />,
        document.querySelector('#content')
        );
        return false;
    });
    ReactDOM.render(
        <DomoForm csrf={csrf} />, document.querySelector('#makeDomo')
    );

    ReactDOM.render(
        <DomoList domos={[]} /> ,document.querySelector('#domos')
    );

    loadDomosFromServer();
}

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});



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

    sendAjax('POST', $('#passForme').attr('action'), $('#passForm').serialize(), redirect);

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