(function () {

    if (!OffWeGoAPI.getToken()) {
        window.location.href = "login.html";
        return;
    }

    const profileName = document.getElementById("profileName");
    const profileEmail = document.getElementById("profileEmail");
    const profilePhoto = document.getElementById("profilePhoto");
    const topbarAvatar = document.getElementById("profileAvatar");
    const changePhotoButton = document.getElementById("changePhotoButton");
    const removePhotoButton = document.getElementById("removePhotoButton");
    const photoInput = document.getElementById("photoInput");
    const photoStatus = document.getElementById("photoStatus");
    const logoutBtn = document.getElementById("logoutBtn");

    function setStatus(message, isError) {
        photoStatus.textContent = message;
        photoStatus.classList.toggle("error", Boolean(isError));
    }

    // Shows the picture inside a circle, or the first letter of the name when there is no picture
    function setPicture(container, user) {

        container.replaceChildren();

        const url = user.avatar && user.avatar.url;

        if (url && url.startsWith("https://")) {

            const picture = document.createElement("img");
            picture.src = url;
            picture.alt = user.name;
            container.appendChild(picture);

        } else {

            container.textContent = user.name.charAt(0).toUpperCase();

        }
    }

    function showUser(user) {

        profileName.textContent = user.name;
        profileEmail.textContent = user.email;

        setPicture(profilePhoto, user);
        setPicture(topbarAvatar, user);

        removePhotoButton.hidden = !(user.avatar && user.avatar.url);
    }

    function setBusy(busy) {
        changePhotoButton.disabled = busy;
        removePhotoButton.disabled = busy;
    }

    OffWeGoAPI.getMe()
        .then(showUser)
        .catch(function (error) {
            if (error.status !== 401) {
                setStatus(error.message, true);
            }
        });

    changePhotoButton.addEventListener("click", function () {
        photoInput.click();
    });

    photoInput.addEventListener("change", async function () {

        const file = photoInput.files[0];

        if (!file) {
            return;
        }

        setBusy(true);
        setStatus("Uploading...", false);

        try {

            const user = await OffWeGoAPI.uploadAvatar(file);
            showUser(user);
            setStatus("Photo updated", false);

        } catch (error) {

            if (error.status !== 401) {
                setStatus(error.message, true);
            }

        } finally {

            setBusy(false);
            photoInput.value = "";

        }

    });

    removePhotoButton.addEventListener("click", async function () {

        if (!confirm("Remove your profile photo?")) {
            return;
        }

        setBusy(true);
        setStatus("Removing...", false);

        try {

            const user = await OffWeGoAPI.deleteAvatar();
            showUser(user);
            setStatus("Photo removed", false);

        } catch (error) {

            if (error.status !== 401) {
                setStatus(error.message, true);
            }

        } finally {

            setBusy(false);

        }

    });

    logoutBtn.addEventListener("click", function () {
        OffWeGoAPI.clearSession();
        window.location.href = "login.html";
    });

})();