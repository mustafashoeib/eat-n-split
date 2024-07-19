import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: 0,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 0,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
  }

  function handleShowFriend() {
    setShowAddFriend((show) => !show);
  }

  function handleSelectFriend(friend) {
    // setSelectedFriend((friend));
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }

  function handleSubmitBill(value) {
    console.log(value);
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );

    setSelectedFriend(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          onSelectionFriend={handleSelectFriend}
          selectedFriend={selectedFriend}
        />

        {showAddFriend && <AddForm onAddFriend={handleAddFriend} />}

        <Button onClick={handleShowFriend}>
          {showAddFriend ? "close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSubmitBill={handleSubmitBill}
        />
      )}
    </div>
  );
}

function FriendList({ friends, onSelectionFriend, selectedFriend }) {
  // const friends = initialFriends;
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          selectedFriend={selectedFriend}
          key={friend.id}
          onSelectionFriend={onSelectionFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelectionFriend, selectedFriend }) {
  const isSelected = selectedFriend && selectedFriend?.id === friend.id;
  return (
    <>
      <li className={isSelected ? "selected" : ""}>
        <img src={friend.image} alt={friend.name} />
        <h3>{friend.name}</h3>
        {friend.balance < 0 && (
          <p className="red">
            You owe {friend.name} {Math.abs(friend.balance)}
          </p>
        )}
        {friend.balance > 0 && (
          <p className="green">
            {friend.name} owes you {Math.abs(friend.balance)}
          </p>
        )}
        {friend.balance === 0 && <p>You and {friend.name} are even</p>}
        <Button onClick={() => onSelectionFriend(friend)}>
          {isSelected ? "close" : "select"}
        </Button>
      </li>
    </>
  );
}

function AddForm({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function submitForm(e) {
    e.preventDefault();
    if (!name || !image) return;

    const id = uuidv4();
    const newFriend = {
      id,
      name,
      image: `${image}?u=${id}`,
      balance: 0,
    };
    onAddFriend(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  // console.log(name, image);
  return (
    <form className="form-add-friend" onSubmit={submitForm}>
      <label>👩🏼‍🤝‍🧑🏻Friend Name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        type="text"
      />

      <label>👾image Url</label>
      <input
        value={image}
        onChange={(e) => setImage(e.target.value)}
        type="text"
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onSubmitBill }) {
  // console.log(selectedFriend.name);
  const [bill, setBill] = useState("");
  const [yourBay, setYourBay] = useState("");
  const FriendExpense = bill - yourBay;
  const [whoIsPaying, setWhoIsPaying] = useState("you");

  function handleSubmitBill(e) {
    e.preventDefault();
    if (!bill || !yourBay) return;

    onSubmitBill(whoIsPaying === "you" ? FriendExpense : -yourBay);
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmitBill}>
      <h2>Split bill with {selectedFriend.name}</h2>

      <label>💰 Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>🙎‍♂️ your expense</label>
      <input
        type="text"
        value={yourBay}
        onChange={(e) =>
          setYourBay(
            Number(e.target.value) > bill ? yourBay : Number(e.target.value)
          )
        }
      />

      <label>👩🏼‍🤝‍🧑🏻{selectedFriend.name} expense</label>
      <input type="text" disabled value={FriendExpense} />

      <label>🤑 who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="you">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split bill</Button>
    </form>
  );
}
