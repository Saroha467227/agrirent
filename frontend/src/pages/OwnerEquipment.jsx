import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, X, Upload, Tractor, MapPin, Tag, Loader2, Image as ImageIcon } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../hooks/useAuth';

const OwnerEquipment = () => {
  const { user } = useAuth();
  const [equipmentList, setEquipmentList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState([]);
  const [submitError, setSubmitError] = useState('');

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const fetchEquipment = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/equipment');
      // Filter to only show the current owner's equipment
      // Assuming 'owner' is populated and has an _id, or is just an ID.
      const myEquipment = data.filter(item => 
        (item.owner?._id || item.owner) === user._id
      );
      setEquipmentList(myEquipment);
    } catch (err) {
      console.error('Failed to fetch equipment:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, [user._id]);

  const handleImageChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).slice(0, 5); // Limit to 5 images
      setSelectedImages(filesArray);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSubmitError('');
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('category', data.category);
      formData.append('pricePerDay', data.pricePerDay);
      formData.append('location', data.location);

      selectedImages.forEach(image => {
        formData.append('images', image);
      });

      await api.post('/equipment', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setIsModalOpen(false);
      reset();
      setSelectedImages([]);
      fetchEquipment();
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to add equipment. Check your Cloudinary config.');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">My Equipment</h1>
            <p className="text-slate-500 mt-1">Manage your fleet and track availability.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-500/30 transition-all hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            Add Equipment
          </button>
        </div>

        {/* Equipment Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
          </div>
        ) : equipmentList.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Tractor className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No Equipment Listed</h3>
            <p className="text-slate-500 mt-2 mb-6 max-w-sm mx-auto">You haven't added any machinery to your fleet yet. Start earning by listing your equipment.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-emerald-600 font-semibold hover:text-emerald-700"
            >
              + List your first equipment
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {equipmentList.map(item => (
              <div key={item._id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-emerald-900/5 transition-all group flex flex-col">
                <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                  <div className="absolute top-3 right-3 z-10">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${item.isAvailable ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {item.isAvailable ? 'Available' : 'Booked'}
                    </span>
                  </div>
                  {item.images && item.images.length > 0 ? (
                    <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <ImageIcon className="w-12 h-12 opacity-20" />
                    </div>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 mb-2 uppercase tracking-wider">
                    <Tag className="w-3.5 h-3.5" /> {item.category}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-1">{item.title}</h3>
                  <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-4">
                    <MapPin className="w-4 h-4" /> {item.location}
                  </div>
                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-slate-900">₹{item.pricePerDay}</span>
                      <span className="text-sm text-slate-500"> /day</span>
                    </div>
                    <button className="text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Add Equipment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-full flex flex-col animate-fade-in-up">
            
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <h2 className="text-xl font-bold text-slate-900">List New Equipment</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              {submitError && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
                  {submitError}
                </div>
              )}

              <form id="add-equipment-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Equipment Title</label>
                    <input 
                      {...register('title', { required: 'Title is required' })}
                      placeholder="e.g. John Deere 5050D"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                    />
                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category</label>
                    <select 
                      {...register('category', { required: 'Category is required' })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all bg-white"
                    >
                      <option value="">Select Category</option>
                      <option value="Tractor">Tractor</option>
                      <option value="Harvester">Harvester</option>
                      <option value="Plow">Plow</option>
                      <option value="Seeder">Seeder</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description</label>
                  <textarea 
                    {...register('description', { required: 'Description is required' })}
                    placeholder="Describe the condition, features, and capabilities..."
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all resize-none"
                  />
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Price Per Day (₹)</label>
                    <input 
                      type="number"
                      {...register('pricePerDay', { required: 'Price is required', min: 1 })}
                      placeholder="e.g. 1500"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                    />
                    {errors.pricePerDay && <p className="text-red-500 text-xs mt-1">{errors.pricePerDay.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Location</label>
                    <input 
                      {...register('location', { required: 'Location is required' })}
                      placeholder="e.g. Karnal, Haryana"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                    />
                    {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Photos (Max 5)</label>
                  <div className="mt-1 flex justify-center px-6 py-8 border-2 border-slate-200 border-dashed rounded-xl hover:border-emerald-400 hover:bg-emerald-50/50 transition-colors cursor-pointer relative">
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg, image/png, image/webp"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="text-center">
                      <Upload className="mx-auto h-10 w-10 text-slate-400 mb-3" />
                      <div className="flex text-sm text-slate-600 justify-center">
                        <span className="relative rounded-md font-semibold text-emerald-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2 hover:text-emerald-500">
                          Upload files
                        </span>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-slate-500 mt-2">PNG, JPG up to 5MB</p>
                    </div>
                  </div>
                  {selectedImages.length > 0 && (
                    <div className="mt-4 flex gap-2 flex-wrap">
                      {selectedImages.map((file, i) => (
                        <div key={i} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-lg border border-emerald-200">
                          {file.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </form>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 sticky bottom-0 z-10 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                form="add-equipment-form"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting ? 'Uploading...' : 'Publish Listing'}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerEquipment;
