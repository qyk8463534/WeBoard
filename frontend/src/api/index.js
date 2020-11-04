import axios from "axios";
export const url = "http://localhost:9900";



/*
 * login
 */
export const login = async (email, password) => {
  const options = {
    method: "POST",
    url: url + "/api/user/accessToken",
    headers: {
      "Content-Type": "application/json"
    },
    data: {
      email: email,
      password: password
    }
  };
  const response = await axios(options);
  if (response && response.status === 200) {
    console.log(response.data);
    localStorage.setItem("token", response.data.accessToken);
    localStorage.setItem("user", response.data._id);
    setTimeout(() => {
      refreshAuthToken();
    }, refreshInterval);
  }

  return response.status;
};

/*
 * register
 */
export const register = async (email, password)=> {
  const options = {
    method: "POST",
    url: url + "/api/user",
    headers: {
      "Content-Type": "application/json"
    },
    data: {
      email: email,
      password: password
    }
  };
  const response = await axios(options);
  if (response && response.status === 200) {
    localStorage.setItem("token", response.data.accessToken);
    localStorage.setItem("user", response.data._id);
    setTimeout(() => {
      refreshAuthToken();
    }, refreshInterval);
    return response.data;
  }
};


/*
 * get boards
 */
export const getKanban = async (kanbanID)=> {
  const options= {
    method: "GET",
    url: url + "/api/kanban/" + kanbanID,
    headers: {
      Authorization: getAuthToken()
    }
  };
  const response = await axios(options);
  if (response && response.status === 200) {
    return response.data;
  } else {
    throw {status: response.status, message: response.statusText};
  }
};

/*
 * update boards
 */
export const updateBoards = async (kanbanID, boards)=> {
  const options = {
    method: "PUT",
    url: url + "/api/kanban/" + kanbanID + "/board",
    headers: {
      Authorization: getAuthToken()
    },
    data: {boards: boards}
  };
  const response = await axios(options);
  return response.data;
};

/*
 * create card
 */
export const createCard = async (
  kanbanID,
  boardName,
  card
)=> {
    console.log(card);
  const options= {
    method: "POST",
    url: url + "/api/kanban/" + kanbanID + "/board/" + boardName + "/card",
    headers: {
      Authorization: getAuthToken(),
      "Content-Type": "application/json"
    },
    data: {
        cardName: card.cardName,
        highestaAcademicLevel:card.highestaAcademicLevel,
        phoneNumber: card.phoneNumber,
        emailAddress: card.emailAddress,
        comments: card.comments
    }
  };
  const response = await axios(options);
  return response.data;
};

/*
 * move card
 */
export const moveCard = async (
  kanbanID,
  oldBoard,
  oldIndex,
  newBoard,
  newIndex
) => {
  const options = {
    method: "PUT",
    url: url + "/api/kanban/" + kanbanID + "/move",
    headers: {
      Authorization: getAuthToken(),
      "Content-Type": "application/json"
    },
    data: {
      oldID: oldBoard,
      oldIndex: oldIndex,
      newID: newBoard,
      newIndex: newIndex
    }
  };
  console.log(options.data,"here");
  const response = await axios(options);
  return response.status;
};

/*
 * update card
 */
export const updateCard = async (
  kanbanID,
  boardID,
  cardID,
  card
) => {
  console.log(card,"card data")
  const options = {
    method: "PUT",
    url: url + "/api/kanban/" + kanbanID + "/board/" +  boardID + "/card/" + cardID,
    headers: {
      Authorization: getAuthToken(),
      "Content-Type": "application/json"
    },
    data: {
        cardName:card.name, 
        highestaAcademicLevel:card.education,
        phoneNumber:card.phone, 
        emailAddress:card.email,
        comments:card.comments
    }
  };
  const response = await axios(options);
  window.location.reload(false);
  return response.status;
};

/*
 * TO DO:delete card
 */

/*
 * check jwt
 */
export const checkJWT = async () => {
  const options = {
    method: "GET",
    url: url + "/api/user/self/accessToken",
    headers: {
      Authorization: getAuthToken()
    }
  };
  const response = await axios(options);
  return response.status;
};

const refreshInterval = 29000000;

/*
 * get accessToken from local
 */
const getAuthToken = () => {
  return "Bearer " + localStorage.getItem("token") || "";
};

/*
 * refresh token
 */
export const refreshAuthToken = async (id) => {
  const options = {
    method: "PUT",
    url: url + "/api/user/self/accessToken",
    headers: {
      Authorization: getAuthToken()
    },
    data: {
      id: id
    }
  };
  const response = await axios(options);
  if (response && response.status === 200) {
    localStorage.setItem("token", response.data.accessToken);
    setTimeout(() => {
      refreshAuthToken();
    }, refreshInterval);
  }
  return response.status;
};