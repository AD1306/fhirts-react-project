import logo from "./logo.svg";
import "./App.css";
import { PatchUtils } from "@smile-cdr/fhirts";
import React, { useState } from "react";
import { PATCH_DATATYPE } from "@smile-cdr/fhirts/dist/library/constants";

function App() {
  const [formData, setFormData] = useState({
    operationType: "move",
    path: "",
    destination: 0,
    source: 0,
    value: {},
    valueDataType: "identifier",
    insertIndex: 0
  });
  const [parameters, setParameters] = useState({
    resource: {},
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  function createPatchParameters() {
    // eslint-disable-next-line no-restricted-globals
    event.preventDefault();
    const patchUtils = new PatchUtils();
    if(formData.operationType === "move") {
      const moveParameters =  patchUtils
      .createMoveParameters(
        formData.path,
        parseInt(formData.source),
        parseInt(formData.destination)
      )
      .getPatchParameters();
      setParameters(() => ({ resource: moveParameters }));
    } else if(formData.operationType === "delete") {
      const deleteParameters = patchUtils
      .createDeleteParameters(formData.path)
      .getPatchParameters();
      setParameters(() => ({ resource: deleteParameters}));
    } else if(formData.operationType === "replace") {
      const replaceParameters = patchUtils
      .createReplaceParameters(
        formData.path,
        JSON.parse(formData.value),
        getCorrespodingPatchDatatypeEnum(formData.valueDataType)
      )
      .getPatchParameters()
      setParameters(() => ({resource:  replaceParameters}));
    } else {
      // path: string, value: any, valueDataType: PATCH_DATATYPE, index: number
      const insertParameters = patchUtils
      .createInsertParameters(
        formData.path,
        JSON.parse(formData.value),
        getCorrespodingPatchDatatypeEnum(formData.valueDataType),
        parseInt(formData.insertIndex)
      )
      .getPatchParameters()
      setParameters(() => ({resource:  insertParameters}));
    }
    
  }

  function getCorrespodingPatchDatatypeEnum(valueDataType) {
    if(valueDataType === 'identifier') {
      return PATCH_DATATYPE.IDENTIFIER;
    } else if(valueDataType === 'address') {
      return PATCH_DATATYPE.ADDRESS;
    }
    return PATCH_DATATYPE.STRING;
  }

  return (
    <div>
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
          <div className="row">
            <h1 className="text-center">FHIR.ts with React</h1>
          </div>
        </div>
      </nav>
      <div className="container">
        <div className="row">
          <h3 className="text-center">Patch Parameters creator</h3>
        </div>
        <div className="row">
          <form action="#">
            <div className="mb-3">
              <label htmlFor="operationType" className="form-label">
                Operation Type
              </label>
              <select
                name="operationType"
                className="form-select"
                value={formData.operationType}
                onChange={handleChange}
              >
                <option value="move" >Move</option>
                <option value="delete">Delete</option>
                <option value="replace">Replace</option>
                <option value="insert">Insert</option>

              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="path" className="form-label">
                Path
              </label>
              <input
                name="path"
                type="text"
                className="form-control"
                value={formData.path}
                onChange={handleChange}
              />
            </div>
            {formData.operationType === "move" ? 
            <div>
            <div className="mb-3">
              <label htmlFor="source" className="form-label">
                Source
              </label>
              <input
                name="source"
                type="text"
                className="form-control"
                value={formData.source}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="destination" className="form-label">
                Destination
              </label>
              <input
                name="destination"
                type="text"
                className="form-control"
                value={formData.destination}
                onChange={handleChange}
              />
            </div> </div>: null}

            {formData.operationType === "replace" ||  formData.operationType === "insert"? 
            <div>
            <div className="mb-3">
              <label htmlFor="value" className="form-label">
                Value
              </label>
              <input
                name="value"
                type="json"
                className="form-control"
                value={formData.value}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
            <select
                name="valueDataType"
                className="form-select"
                value={formData.valueDataType}
                onChange={handleChange}
              >
                <option value="identifier">Identifier</option>
                <option value="address">Address</option>
                <option value="string">String</option>
              </select>
            </div> </div>: null}

            {formData.operationType === "insert" ? 
            <div className="mb-3">
              <label htmlFor="insertIndex" className="form-label">
                Insert Index
              </label>
              <input
                name="insertIndex"
                type="text"
                className="form-control"
                value={formData.insertIndex}
                onChange={handleChange}
              />
             </div>: null}
            

            <button onClick={createPatchParameters} className="btn btn-primary">
              Create Parameters
            </button>
          </form>
        </div>
      </div>

      <div className="container">
        <pre>{JSON.stringify(parameters.resource, undefined, 2)}</pre>
      </div>
    </div>
  );
}

export default App;
