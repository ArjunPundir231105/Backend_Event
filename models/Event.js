const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
title:        { type: String, required: true },
date:         { type: String },
venue:        { type: String },
address:      { type: String },
city:         { type: String, default: 'Sydney' },
description:  { type: String },
category:     { type: String },
imageUrl:     { type: String },
sourceWebsite:{ type: String },
originalUrl:  { type: String, unique: true },
lastScraped:  { type: Date, default: Date.now },
status:       { type: String, enum: ['new','updated','inactive','imported'], default: 'new' },
importedAt:   { type: Date },
importedBy:   { type: String },
importNotes:  { type: String },
  contentHash:  { type: String }, // to detect updates
});

module.exports = mongoose.model('Event', EventSchema);