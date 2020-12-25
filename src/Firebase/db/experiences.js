import { db } from '../firebase'

export const addExperience = async payload => {
  try {
    const docRef = await db
      .collection(process.env.GATSBY_EXPERIENCE_COLLECTION_NAME)
      .doc()

    await docRef.set(payload)

    return { ...payload, docId: docRef.id }
  } catch (error) {
    throw error
  }
}

const getExperiencesQuery = (
  uid,
  query,
  categories = [],
  fromDate = null,
  toDate = null
) => {
  const LIMIT = 20

  if (categories.length > 0) {
    query = query.where('categories', 'array-contains-any', categories)
  }

  return query.get().then(async function(documentSnapshots) {
    const lastVisible =
      documentSnapshots.docs[documentSnapshots.docs.length - 1]

    let data = []
    let nextQuery = null
    let isOutOfQueries = documentSnapshots.docs.length === 0

    if (documentSnapshots.docs.length > 0) {
      data = documentSnapshots.docs.map(doc => {
        return {
          ...doc.data(),
          docId: doc.id,
        }
      })

      nextQuery = db
        .collection(process.env.GATSBY_EXPERIENCE_COLLECTION_NAME)
        .where('uid', '==', uid)

      if (categories.length > 0) {
        nextQuery = nextQuery.where(
          'categories',
          'array-contains-any',
          categories
        )
      }

      nextQuery = nextQuery
        .orderBy('date', 'desc')
        .startAfter(lastVisible)
        .limit(LIMIT)

      const nextDocumentSnapshots = await nextQuery.get()

      isOutOfQueries = nextDocumentSnapshots.docs.length === 0
    }

    return {
      experiences: data,
      nextQuery: nextQuery,
      isOutOfQueries: isOutOfQueries,
    }
  })
}

export const getExperiences = async (
  uid,
  categories = [],
  fromDate = null,
  toDate = null,
  nextQuery = null
) => {
  let query

  if (nextQuery) {
    query = nextQuery
  } else {
    query = db
      .collection(process.env.GATSBY_EXPERIENCE_COLLECTION_NAME)
      .where('uid', '==', uid)
  }

  return getExperiencesQuery(uid, query, categories, fromDate, toDate)
}

export const getExperience = async docId => {
  return db
    .collection(process.env.GATSBY_EXPERIENCE_COLLECTION_NAME)
    .doc(docId)
    .get()
    .then(doc => {
      if (doc.exists) {
        return {
          ...doc.data(),
          docId: doc.id,
        }
      } else {
        // doc.data() will be undefined in this case
        throw 'Data could not be found for the story'
      }
    })
    .catch(error => {
      throw 'Data could not be found for the story'
    })
}
export const updateExperience = async (docId, data) => {
  try {
    const updateResult = await db
      .collection(process.env.GATSBY_EXPERIENCE_COLLECTION_NAME)
      .doc(docId)
      .update({
        ...data,
      })

    return updateResult
  } catch (error) {
    throw error
  }
}
export const deleteExperience = async docId => {
  try {
    const deletedDoc = db
      .collection(process.env.GATSBY_EXPERIENCE_COLLECTION_NAME)
      .doc(docId)
      .delete()

    return deletedDoc
  } catch (error) {
    throw error
  }
}
