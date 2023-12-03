import React, { useEffect } from "react";

const KommunicateChat = () => {
  useEffect(() => {
(function(d, m){
        var kommunicateSettings = {"appId":"25ef69ac1ffe9242f8c7c5c7f1e28a98d","popupWidget":true,"automaticChatOpenOnNavigation":true};
        var s = document.createElement("script"); s.type = "text/javascript"; s.async = true;
        s.src = "https://widget.kommunicate.io/v2/kommunicate.app";
        var h = document.getElementsByTagName("head")[0]; h.appendChild(s);
        window.kommunicate = m; m._globals = kommunicateSettings;
      })(document, window.kommunicate || {});
  }, []);

  return <div />;
};

export default KommunicateChat;
