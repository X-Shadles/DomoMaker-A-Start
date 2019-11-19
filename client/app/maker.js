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
                <h3 className="domoTweet">{domo.name}: {domo.tweet}</h3>
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
            <DomoList domos={data.domos}/>, document.querySelector('#domos')
        );
    });
};

const setup = function(csrf) {
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