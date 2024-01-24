import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { thunkFetchCreateSpot } from "../../store/spot";
import { thunkFetchCreateSpotImage } from "../../store/spotImages";
import { useNavigate } from "react-router-dom";

function CreateNewSpotFormPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [country, setCountry] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')
  const [description, setDescription] = useState('')
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [previewImage, setPreviewImage] = useState('')
  const [image1, setImage1] = useState('')
  const [image2, setImage2] = useState('')
  const [image3, setImage3] = useState('')
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})



  const handleSubmit = (e) => {
    e.preventDefault();

    setHasSubmitted(true)
    if (Object.keys(validationErrors).length > 0) {
      console.log(hasSubmitted)
      console.log(validationErrors)
      return null
    }
    let newSpot = {
      address,
      city,
      state,
      country,
      lat,
      lng,
      description,
      name: title,
      price
    }

    let images = [image1, image2, image3]
    dispatch(thunkFetchCreateSpot(newSpot)).then(responseSpot => {
      const promises = [];
      promises.push(dispatch(thunkFetchCreateSpotImage(responseSpot.id, previewImage, true))) //the true indicates that it's a preview image which should be in the body of the post request
      images.forEach(imageUrl => {
        promises.push(dispatch(thunkFetchCreateSpotImage(responseSpot.id, imageUrl, false)))
      })
      Promise.all(promises).then(() => navigate(`/spots/${responseSpot.id}`))
    })
    

    setAddress('')
    setCountry('')
    setCity('')
    setState('')
    setLat('')
    setLng('')
    setDescription('')
    setTitle('')
    setPrice('')
    setPreviewImage('')
    setImage1('')
    setImage2('')
    setImage3('')
    setHasSubmitted(false)


  }

  useEffect(() => {
    let errors = {}
    if (!country.length > 0) errors.country = 'Country is required'
    if (!address.length > 0) errors.address = 'Address is required'
    if (!city.length > 0) errors.city = 'City is required'
    if (!state.length > 0) errors.state = 'State is required'
    if (!lat.length > 0) errors.lat = 'Lat is required'
    if (!lng.length > 0) errors.lng = 'Lng is required'
    if (!description.length > 0 || description.length < 30) errors.description = 'Description needs a minimum of 30 characters'
    if (!title.length > 0) errors.title = 'Name is required'
    if (!price.length > 0) errors.price = 'Price is required'
    if (!previewImage.length > 0) errors.previewImage = 'Preview image is required'
    if (!imageFileTypeValidation(previewImage)) errors.previewImage = 'Image URL needs to end in png or jpg (or jpeg)'
    if (!imageFileTypeValidation(image1)) errors.image1 = 'Image URL needs to end in png or jpg (or jpeg)'
    if (!imageFileTypeValidation(image2)) errors.image2 = 'Image URL needs to end in png or jpg (or jpeg)'
    if (!imageFileTypeValidation(image3)) errors.image3 = 'Image URL needs to end in png or jpg (or jpeg)'

    setValidationErrors(errors)
  }, [country, address, city, state, lat, lng, description, title, price, previewImage, image1, image2, image3])

  function imageFileTypeValidation(imageUrl) {
    if (imageUrl.length < 1) return true
    if (imageUrl.endsWith('jpg')) return true;
    if (imageUrl.endsWith('jpeg')) return true;
    if (imageUrl.endsWith('png')) return true;
    return false
  }


  return (
    <>
      <h1>Create a new Spot</h1>
      <form onSubmit={handleSubmit}>
      <h2>Wheres your place located?</h2>
      <h4>Guests will only get your exact address once they booked a reservation</h4>
      <label>
        Country
        <input
          type='text'
          value={country}
          placeholder="Country"
          onChange={(e) => setCountry(e.target.value)}
          name='locationCountry'
          required
        />
      </label>
      {hasSubmitted && validationErrors.country && 
        <div>{validationErrors.country}</div>
      }
      <label>
        Street Address
        <input
          type='text'
          value={address}
          placeholder="Street Address"
          onChange={(e) => setAddress(e.target.value)}
          name='streetAddress'
          required
        />
      </label>
      {hasSubmitted && validationErrors.address && 
        <div>{validationErrors.address}</div>
      }
      <label>
        City
        <input
          type='text'
          value={city}
          placeholder="City"
          onChange={(e) => setCity(e.target.value)}
          name='city'
          required
        />
      </label>
      {hasSubmitted && validationErrors.city && 
        <div>{validationErrors.city}</div>
      }
      <label>
        State
        <input
          type='text'
          value={state}
          placeholder="State"
          onChange={(e) => setState(e.target.value)}
          name='state'
          required
        />
      </label>
      {hasSubmitted && validationErrors.state && 
        <div>{validationErrors.state}</div>
      }
      <label>
        Latitude
        <input
          type='text'
          value={lat}
          placeholder="Latitude"
          onChange={(e) => setLat(e.target.value)}
          name='latitude'
          required
        />
      </label>
      {hasSubmitted && validationErrors.lat && 
        <div>{validationErrors.lat}</div>
      }
      <label>
        Longitude
        <input
          type='text'
          value={lng}
          placeholder="Longitude"
          onChange={(e) => setLng(e.target.value)}
          name='longitude'
          required
        />
      </label>
      {hasSubmitted && validationErrors.lng && 
        <div>{validationErrors.lng}</div>
      }
      <h2>Describe your place to guests</h2>
      <p>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>       
        <textarea
          value={description}
          placeholder="Please write at least 30 characters"
          onChange={(e) => setDescription(e.target.value)}
          name='description'
          required
        />
        {hasSubmitted && validationErrors.description && 
        <div>{validationErrors.description}</div>
        }
      <h2>Create a title for your spot</h2>
      <p>Catch guests attention with a spot title that highlights what makes your place special.</p>       
        <input
          type='text'
          value={title}
          placeholder="Name of your spot"
          onChange={(e) => setTitle(e.target.value)}
          required
          name='title'
        />
        {hasSubmitted && validationErrors.title && 
        <div>{validationErrors.title}</div>
      }
      <h2>Set a base price for your spot</h2>
      <p>Competitive pricing can help your listing stand out and rank higher in search results</p>
      <label>
        $
        <input
          type='text'
          value={price}
          placeholder="Price per night (USD)"
          onChange={(e) => setPrice(e.target.value)}
          name='price'
          required
        />
      </label>   
      {hasSubmitted && validationErrors.price && 
        <div>{validationErrors.price}</div>
      }
      <h2>Liven up your spot with photos</h2>
      <p>Submit a link to at least one photo to publish your spot</p>       
        <input
          type='text'
          value={previewImage}
          placeholder="Preview Image URL"
          onChange={(e) => setPreviewImage(e.target.value)}
          name='previewImage'
          required
        />  
        {hasSubmitted && validationErrors.previewImage && 
        <div>{validationErrors.previewImage}</div>
        }
        <input
          type='text'
          value={image1}
          placeholder="Image URL"
          onChange={(e) => setImage1(e.target.value)}
          name='image1'
        />  
        {hasSubmitted && validationErrors.image1 && 
        <div>{validationErrors.image1}</div>
        }
        <input
          type='text'
          value={image2}
          placeholder="Image URL"
          onChange={(e) => setImage2(e.target.value)}
          name='image2'

        /> 
        {hasSubmitted && validationErrors.image2 && 
        <div>{validationErrors.image2}</div>
        } 
        <input
          type='text'
          value={image3}
          placeholder="Image URL"
          onChange={(e) => setImage3(e.target.value)}
          name='image3'

        />  
        {hasSubmitted && validationErrors.image3 && 
        <div>{validationErrors.image3}</div>
        }
      <button   type='submit'>Create Spot</button>
      </form>
      
    
    </>
  )
}

export default CreateNewSpotFormPage