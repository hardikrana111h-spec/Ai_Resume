import { useEffect, useState } from "react";
import axios from "axios";

import {
  Search,
  Eye,
  Trash2,
  Star,
  Mail,
  Reply,
} from "lucide-react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";

const API =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

export default function AdminContacts() {
  const [contacts, setContacts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [selectedContact, setSelectedContact] =
    useState(null);

  const [viewOpen, setViewOpen] =
    useState(false);

  const [replyOpen, setReplyOpen] =
    useState(false);

  const [reply, setReply] =
    useState("");

  const token =
    localStorage.getItem("token");

  const fetchContacts =
    async () => {
      try {
        const res = await axios.get(
          `${API}/api/admin/contacts`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setContacts(
          res.data.contacts || []
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchContacts();
  }, []);

  const filteredContacts =
    contacts.filter((contact) => {
      return (
        contact.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        contact.email
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        contact.message
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
      );
    });

  const toggleImportant =
    async (id) => {
      try {
        await axios.patch(
          `${API}/api/admin/contacts/${id}/important`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        fetchContacts();
      } catch (error) {
        console.error(error);
      }
    };

  const deleteContact =
    async (id) => {
      if (
        !window.confirm(
          "Delete this contact?"
        )
      )
        return;

      try {
        await axios.delete(
          `${API}/api/admin/contacts/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        fetchContacts();
      } catch (error) {
        console.error(error);
      }
    };

  const sendReply =
    async () => {
      try {
        await axios.post(
          `${API}/api/admin/contacts/${selectedContact._id}/reply`,
          { reply },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setReply("");
        setReplyOpen(false);

        fetchContacts();
      } catch (error) {
        console.error(error);
      }
    };

  const pendingCount =
    contacts.filter(
      (c) => c.status === "pending"
    ).length;

  const repliedCount =
    contacts.filter(
      (c) => c.status === "replied"
    ).length;

  return (
    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">
        Contact Messages
      </h1>

      {/* Stats */}

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow p-4">
          <h3>Total</h3>
          <p className="text-3xl font-bold">
            {contacts.length}
          </p>
        </div>

        <div className="bg-yellow-50 rounded-xl shadow p-4">
          <h3>Pending</h3>
          <p className="text-3xl font-bold">
            {pendingCount}
          </p>
        </div>

        <div className="bg-green-50 rounded-xl shadow p-4">
          <h3>Replied</h3>
          <p className="text-3xl font-bold">
            {repliedCount}
          </p>
        </div>
      </div>

      {/* Search */}

      <div className="relative mb-6">
        <Search
          className="absolute left-3 top-3"
          size={18}
        />

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full border rounded-lg pl-10 pr-4 py-3"
        />
      </div>

      {/* Table */}

      <div className="bg-white rounded-xl shadow overflow-x-auto">

        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="p-4 text-left">
                Name
              </th>

              <th className="p-4 text-left">
                Email
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-left">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="4"
                  className="p-8 text-center"
                >
                  Loading...
                </td>
              </tr>
            ) : filteredContacts.length ===
              0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="p-8 text-center"
                >
                  No contacts found
                </td>
              </tr>
            ) : (
              filteredContacts.map(
                (contact) => (
                  <tr
                    key={contact._id}
                    className="border-b"
                  >
                    <td className="p-4">
                      {contact.name}
                    </td>

                    <td className="p-4">
                      {contact.email}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          contact.status ===
                          "replied"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {contact.status}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex gap-2">

                        <button
                          onClick={() => {
                            setSelectedContact(
                              contact
                            );
                            setViewOpen(
                              true
                            );
                          }}
                        >
                          <Eye
                            size={18}
                          />
                        </button>

                        <button
                          onClick={() =>
                            toggleImportant(
                              contact._id
                            )
                          }
                        >
                          <Star
                            size={18}
                            fill={
                              contact.important
                                ? "currentColor"
                                : "none"
                            }
                          />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedContact(
                              contact
                            );
                            setReplyOpen(
                              true
                            );
                          }}
                        >
                          <Reply
                            size={18}
                          />
                        </button>

                        <button
                          onClick={() =>
                            deleteContact(
                              contact._id
                            )
                          }
                        >
                          <Trash2
                            size={18}
                          />
                        </button>

                      </div>
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>

      {/* View Dialog */}

      <Dialog
        open={viewOpen}
        onClose={() =>
          setViewOpen(false)
        }
        fullWidth
      >
        <DialogTitle>
          Contact Details
        </DialogTitle>

        <DialogContent>
          {selectedContact && (
            <>
              <p>
                <b>Name:</b>{" "}
                {
                  selectedContact.name
                }
              </p>

              <p>
                <b>Email:</b>{" "}
                {
                  selectedContact.email
                }
              </p>

              <p className="mt-4">
                <b>Message:</b>
              </p>

              <p>
                {
                  selectedContact.message
                }
              </p>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Reply Dialog */}

      <Dialog
        open={replyOpen}
        onClose={() =>
          setReplyOpen(false)
        }
        fullWidth
      >
        <DialogTitle>
          Reply Message
        </DialogTitle>

        <DialogContent>
          <TextField
            multiline
            rows={5}
            fullWidth
            value={reply}
            onChange={(e) =>
              setReply(
                e.target.value
              )
            }
            placeholder="Type reply..."
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() =>
              setReplyOpen(false)
            }
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={sendReply}
          >
            Send Reply
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}