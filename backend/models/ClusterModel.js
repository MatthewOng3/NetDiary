const mongoose = require('mongoose')

const clusterSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    clusters: [
        {
            clusterId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User.collections.categoryList.listEntries.entryId',
                required: true,
            },
            clusterEntries: [
                {
                    clusterEntryId: { type: mongoose.Schema.Types.ObjectId, unique: true, sparse: true },
                    name: { type: String },
                    link: { type: String },
                }
            ],
        }

    ]

}, {
    _id: false,
    timestamps: true
})

const Cluster = mongoose.model('Cluster', clusterSchema)
module.exports = Cluster
