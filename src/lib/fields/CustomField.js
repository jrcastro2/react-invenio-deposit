// This file is part of React-Invenio-Deposit
// Copyright (C) 2020-2022 CERN.
// Copyright (C) 2020 Northwestern University.
//
// React-Invenio-Deposit is free software; you can redistribute it and/or modify it
// under the terms of the MIT License; see LICENSE file for more details.

import _get from "lodash/get";
import _set from "lodash/set";
import _cloneDeep from "lodash/cloneDeep";
import _isArray from "lodash/isArray";
import { Field } from "./Field";

export class CustomField extends Field {
  constructor({
    fieldpath,
    deserializedDefault = null,
    serializedDefault = null,
    allowEmpty = false,
    vocabularyFields = [],
  }) {
    super({ fieldpath, deserializedDefault, serializedDefault, allowEmpty });
    this.vocabularyFields = vocabularyFields;
  }

  #mapCustomFields(record, customFields, mapValue) {
    if (customFields !== null) {
      for (const [key, value] of Object.entries(customFields)) {
        const isVocabularyField = this.vocabularyFields.includes(key);
        if (isVocabularyField) {
          const _value = _isArray(value) ? value.map(mapValue) : mapValue(value);
          record = _set(record, `custom_fields.${key}`, _value);
        } else {
          record = _set(record, `custom_fields.${key}`, value);
        }
      }
    }
  }

  deserialize(record) {
    const _deserialize = (value) => {
      if (value?.id) {
        return value.id;
      }
      return value;
    };
    const _record = _cloneDeep(record);
    const customFields = _get(record, this.fieldpath, this.deserializedDefault);
    this.#mapCustomFields(_record, customFields, _deserialize);
    return _record;
  }

  serialize(record) {
    const _serialize = (value) => {
      if (typeof value === "string") {
        return { id: value };
      }
      return value;
    };
    const _record = _cloneDeep(record);
    const customFields = _get(record, this.fieldpath, this.serializedDefault);
    this.#mapCustomFields(_record, customFields, _serialize);
    return _record;
  }
}