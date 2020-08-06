import { assert } from 'chai'
import { TestPhoto } from '../../domain/model/TestPhoto'
import { CollectionUpdateUtil } from '../../../../libsrc/persistence/CollectionUpdateUtil'

describe('CollectionUpdateUtil', function () {
  it('should not update identical collection', function () {
    const photosUrls = [
      'https://picsum.photos/id/486/536/354.jpg',
      'https://picsum.photos/id/457/536/354.jpg',
      'https://picsum.photos/id/913/536/354.jpg'
    ]

    const photosValues = photosUrls.map(url => new TestPhoto(url))

    const updatedValues = updatePhotoCollection(photosValues, photosUrls)
    assert.lengthOf(updatedValues, 3)

    for (const valueIndex in updatedValues) {
      assert.equal(photosValues[valueIndex], updatedValues[valueIndex])
    }
  })

  it('should push into collection', function () {
    const photosUrls = [
      'https://picsum.photos/id/486/536/354.jpg',
      'https://picsum.photos/id/457/536/354.jpg'
    ]

    const photosValues = photosUrls.map(url => new TestPhoto(url))

    photosUrls.push('https://picsum.photos/id/913/536/354.jpg')

    const updatedValues = updatePhotoCollection(photosValues, photosUrls)
    assert.lengthOf(updatedValues, 3)

    for (const valueIndex in updatedValues) {
      const valueIndexInt = parseInt(valueIndex, 10)
      if (valueIndexInt < photosValues.length) {
        assert.equal(photosValues[valueIndex], updatedValues[valueIndex])
      } else {
        assert.instanceOf(updatedValues[valueIndex], TestPhoto)
        assert.notEqual(photosValues[valueIndex], updatedValues[valueIndex])
      }
    }
  })

  it('should unshift into collection', function () {
    const photosUrls = [
      'https://picsum.photos/id/486/536/354.jpg',
      'https://picsum.photos/id/457/536/354.jpg'
    ]

    const photosValues = photosUrls.map(url => new TestPhoto(url))

    photosUrls.unshift('https://picsum.photos/id/913/536/354.jpg')
    assert.lengthOf(photosUrls, 3)

    const updatedValues = updatePhotoCollection(photosValues, photosUrls)

    for (const valueIndex in updatedValues) {
      const valueIndexInt = parseInt(valueIndex, 10)
      if (valueIndexInt > 0) {
        assert.equal(photosValues[valueIndexInt - 1], updatedValues[valueIndex])
      } else {
        assert.instanceOf(updatedValues[valueIndex], TestPhoto)
        assert.notEqual(photosValues[valueIndex], updatedValues[valueIndex])
      }
    }
  })

  it('should insert into collection and move element', function () {
    const photosUrls = [
      'https://picsum.photos/id/486/536/354.jpg',
      'https://picsum.photos/id/457/536/354.jpg',
      'https://picsum.photos/id/913/536/354.jpg'
    ]

    const photosValues = photosUrls.map(url => new TestPhoto(url))

    photosUrls[1] = 'https://picsum.photos/id/914/536/354.jpg'
    photosUrls.splice(2, 0, 'https://picsum.photos/id/457/536/354.jpg')

    const updatedValues = updatePhotoCollection(photosValues, photosUrls)

    assert.lengthOf(updatedValues, 4)
    assert.equal(updatedValues[0], photosValues[0])
    assert.notEqual(photosValues[1], updatedValues[1])
    assert.equal(photosValues[1], updatedValues[2])
  })

  it('should unshift into collection async', async function () {
    const photosUrls = [
      'https://picsum.photos/id/486/536/354.jpg',
      'https://picsum.photos/id/457/536/354.jpg'
    ]

    const photosValues = photosUrls.map(url => new TestPhoto(url))

    photosUrls.unshift('https://picsum.photos/id/913/536/354.jpg')
    assert.lengthOf(photosUrls, 3)

    const updatedValues = await CollectionUpdateUtil.fromAsync(
      photosValues, photosUrls,
      (item) => item.getUrl(),
      async (value, index, oldItem) => (
        oldItem || Promise.resolve(new TestPhoto(value))
      )
    )

    for (const valueIndex in updatedValues) {
      const valueIndexInt = parseInt(valueIndex, 10)
      if (valueIndexInt > 0) {
        assert.equal(photosValues[valueIndexInt - 1], updatedValues[valueIndex])
      } else {
        assert.instanceOf(updatedValues[valueIndex], TestPhoto)
        assert.notEqual(photosValues[valueIndex], updatedValues[valueIndex])
      }
    }
  })
})

const updatePhotoCollection = (old: TestPhoto[], values: string[]) => {
  return CollectionUpdateUtil.from(
    old, values,
    (item) => item.getUrl(),
    (value, index, old) => old || new TestPhoto(value)
  )
}
