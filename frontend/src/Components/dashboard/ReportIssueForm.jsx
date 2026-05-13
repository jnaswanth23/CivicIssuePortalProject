import { useMemo, useState } from "react";
import api from "../../api/axios";
import "../../styles/ReportIssueForm.css";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";

/* Map click handler */
function LocationPicker({ setCoords, fetchAddress, setAddress }) {

  useMapEvents({
    click: async (e) => {

      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      const result = await fetchAddress(lat, lng);

      if (result.state !== "Andhra Pradesh") {
        alert("❌ Reporting allowed only inside Andhra Pradesh");
        return;
      }

      setCoords({ lat, lng });
      setAddress(result.address);
    }
  });

  return null;
}

export default function ReportIssueForm() {

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("ROAD");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [coords, setCoords] = useState(null);
  const [address, setAddress] = useState("");
  const [locLoading, setLocLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [createdId, setCreatedId] = useState(null);

  const previewUrl = useMemo(() => {
    if (!imageFile) return "";
    return URL.createObjectURL(imageFile);
  }, [imageFile]);

  /* Reverse geocode address + state */
  const fetchAddress = async (lat, lng) => {
    try {

      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );

      const data = await res.json();

      return {
        address: data.display_name || "",
        state: data.address?.state || ""
      };

    } catch {

      return { address: "", state: "" };

    }
  };

  /* Get current GPS location */
  const getLocation = () => {

    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    setLocLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {

        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        const result = await fetchAddress(lat, lng);

        if (result.state !== "Andhra Pradesh") {

          setLocLoading(false);

          alert("❌ Your current location is outside Andhra Pradesh");

          return;
        }

        setCoords({ lat, lng });
        setAddress(result.address);

        setLocLoading(false);
      },
      () => {
        setLocLoading(false);
        alert("Location permission denied.");
      },
      { enableHighAccuracy: true }
    );
  };

  const validate = () => {

    if (!title.trim()) return "Title is required";
    if (!description.trim()) return "Description is required";
    if (!imageFile) return "Issue image is required";
    if (!coords) return "Select location";

    return "";
  };

  const onSubmit = async (e) => {

    e.preventDefault();

    const err = validate();
    if (err) return alert(err);

    try {

      setLoading(true);
      setCreatedId(null);

      const fd = new FormData();

      fd.append("title", title.trim());
      fd.append("category", category);
      fd.append("description", description.trim());
      fd.append("address", address.trim());
      fd.append("latitude", String(coords.lat));
      fd.append("longitude", String(coords.lng));
      fd.append("image", imageFile);

      const res = await api.post("/api/issues/submit", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const issueId = res?.data?.id || res?.data?.issueId;

      setCreatedId(issueId || null);

      alert(
        issueId
          ? `✅ Issue submitted! Your Issue ID: ${issueId}`
          : "✅ Issue submitted!"
      );

      setTitle("");
      setCategory("ROAD");
      setDescription("");
      setImageFile(null);
      setAddress("");

    } catch (error) {

      alert(error?.response?.data?.message || "❌ Failed to report issue");

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="reportWrap">

      <div className="reportHeaderNice">
        <div>
          <h2>Report a Problem</h2>
          <p>Upload a real photo, add details, and attach your current location.</p>
        </div>

        {createdId && (
          <div className="issueIdBox">
            <div className="issueIdLabel">Your Issue ID</div>
            <div className="issueIdRow">
              <div className="issueIdValue">{createdId}</div>
            </div>
          </div>
        )}
      </div>

      <form className="reportGrid" onSubmit={onSubmit}>

        <div className="reportCardNice">

          <label className="lbl">Issue Title</label>
          <input
            className="inp"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label className="lbl">Category</label>
          <select
            className="inp"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="ROAD">Road / Pothole</option>
            <option value="ELECTRICITY">Electricity</option>
            <option value="WATER">Water</option>
            <option value="SANITATION">Sanitation</option>
            <option value="DRAINAGE">Drainage</option>
            <option value="PUBLIC_SAFETY">Public Safety</option>
            <option value="OTHER">Other</option>
          </select>

          <label className="lbl">Description</label>
          <textarea
            className="inp ta"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="twoCol">

            <div>
              <label className="lbl">Nearest Address</label>
              <input
                className="inp"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div>
              <label className="lbl">Issue Photo</label>
              <input
                className="file"
                type="file"
                accept="image/*"
                onChange={(e) => {

                  const file = e.target.files?.[0];
                  if (!file) return;

                  if (!file.type.startsWith("image/")) {
                    alert("Please upload an image file only");
                    return;
                  }

                  setImageFile(file);
                }}
              />
            </div>

          </div>

          <div className="locationCard">

            <div className="locationTop">
              <button
                type="button"
                className="btnGhost"
                onClick={getLocation}
              >
                📍 Use my current location
              </button>
            </div>

            <div className="locationInfo">
              {coords && (
                <>
                  <span className="pill">Lat: {coords.lat.toFixed(5)}</span>
                  <span className="pill">Lng: {coords.lng.toFixed(5)}</span>
                  {address && <div className="pill">{address}</div>}
                </>
              )}
            </div>

          </div>

          <MapContainer
            center={[15.9129, 79.74]}
            zoom={7}
            style={{ height: "300px", width: "100%", marginTop: "10px" }}
          >

            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <LocationPicker
              setCoords={setCoords}
              fetchAddress={fetchAddress}
              setAddress={setAddress}
            />

            {coords && <Marker position={[coords.lat, coords.lng]} />}

          </MapContainer>

          <button className="btnPrimary" type="submit">
            {loading ? "Submitting..." : "Submit Issue"}
          </button>

        </div>

        <div className="previewCardNice">

          <div className="previewBox">

            {previewUrl ? (
              <img src={previewUrl} alt="preview" className="previewImg" />
            ) : (
              <div>Select image</div>
            )}

          </div>

        </div>

      </form>
    </div>
  );
}