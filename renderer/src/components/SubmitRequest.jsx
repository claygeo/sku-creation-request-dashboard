import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import emailjs from 'emailjs-com';
import { supabase } from '../utils/supabase';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz'; // Use toZonedTime instead

const SubmitRequest = () => {
  const navigate = useNavigate();

  // Initialize dateRequested in Eastern Time
  const getEasternTimeDate = () => {
    try {
      const now = new Date();
      const easternTime = toZonedTime(now, 'America/New_York'); // Interpret the current time in Eastern Time
      return format(easternTime, 'yyyy-MM-dd'); // Format as YYYY-MM-DD for the date_requested column
    } catch (error) {
      console.error('Error setting Eastern Time date:', error);
      // Fallback to local date if timezone conversion fails
      return format(new Date(), 'yyyy-MM-dd');
    }
  };

  const [formData, setFormData] = useState({
    dateRequested: getEasternTimeDate(), // Set date in Eastern Time, formatted as YYYY-MM-DD
    requesterEmail: '',
    distributorMenuName: '',
    brand: '',
    masterCategory: '',
    subcategory1: '',
    subcategory2: '',
    productLine: '',
    productAttribute: '',
    strain: '',
    dominance: '',
    flavor: '',
    cannabinoids: '',
    ttlThc: '',
    ttlCbd: '',
    qtyInPack: '',
    cost: '',
    itemIndexNumber: '',
  });
  const [progress, setProgress] = useState(0);

  const brands = [
    'Aerospaced', 'Airvape', 'Anthem', 'Ardent', 'Arizer', 'Banana Brothers', 'Blue Kudu', 'B Noble', 'Boundless', 'Boveda',
    'Cali Crusher', 'Chill', 'Combie Go', 'Curaleaf', 'Digit', 'DaVinci', 'Drift', 'Edie Parker', 'Find', 'Flowermate',
    'FreshStor', 'G Pen', 'Grassroots', 'Grassroots x Revelry', 'Grav', 'Greenlane Dispensary Services', 'Gron', 'JAMS',
    'Jonathan Adler', 'KandyPens', 'Lookah', 'LuvBuds', 'Pax Labs', 'Plant Precision', 'Puffco', 'Raw', 'Reef', 'Select',
    'Stella', 'Studenglass', 'UKU', 'Vessel', 'Vibes', 'Yocan', 'Zig Zag'
  ];

  const masterCategories = [
    'Beverage', 'Concentrates', 'Edibles', 'Flower', 'Oral', 'Pet', 'Plant', 'Pre-Rolls', 'Topical', 'Vape'
  ];

  const subcategories1 = [
    'Infusion', 'Ready-to-Drink', 'Shot', 'Badder', 'Budder', 'Crumble', 'Diamonds', 'Hash', 'Honeycomb', 'Isolate',
    'Jam', 'Jelly', 'Kief', 'Moonrocks', 'Oil', 'Resin', 'Rosin', 'Sap', 'Sauce', 'Shatter', 'Sugar', 'Sunrocks', 'Wax',
    'Baked Goods', 'Caramel', 'Chocolate', 'Cookie', 'Gummies', 'Hard Candy', 'Lozenges', 'Mints', 'Pantry', 'Snacks',
    'Taffy', 'Troche', 'Deli Style', 'Ground Flower', 'Shake', 'Small Buds', 'Whole Flower', 'Capsules', 'Gel', 'Spray',
    'Tablets', 'Tincture', 'Drops', 'Treats', 'Seeds', 'Pre-Roll', 'Pre-Roll Pack', 'Balm', 'Bath Salts', 'Body Oil',
    'Cream', 'Lip Balm', 'Lotion', 'Patch', 'Rollerball', 'Salve', 'Suppository', 'All-In-One', 'Cartridge', 'Pod'
  ];

  const subcategories2 = [
    'Bar', 'Bites', 'Blunt', 'BRIQ', 'Brownie', 'Brownie Mix', 'Budder Wax', 'Cake', 'Cake Bites', 'Candies', 'Cereal Bar',
    'Chewable Gels', 'CLIQ', 'Coconut Oil', 'Coffee Beans', 'Cookie', 'Crumble Wax', 'Cups', 'Dablicator', 'Diamond Dust',
    'Diamonds & Sauce', 'Doob', 'Dropper', 'Drops', 'Fruit Chew', 'Fruit STIQ', 'Ghee', 'Ground Flower & Sand', 'Honey',
    'Kit', 'Little Nugs', 'Lollipop', 'Luster Pod', 'Mini Blunts', 'Mini Buds', 'Minis', 'Mixed Buds', 'Olive Oil', 'Patty',
    'Popcorn', 'Pretzel', 'Pretzel Balls', 'Pull N Snap', 'Puppy Chow', 'Reload Pod', 'Rice Treat', 'Sand', 'Seasoning',
    'Shorties', 'Smalls', 'STIQ', 'Sugar', 'Sugar & Sauce', 'Sugar Wax', 'Syringe', 'Syrup', 'Tart', 'Terp Sugar', 'Trim',
    'Trim & Shake'
  ];

  const productLines = ['Bites', 'Elite', 'Elite Live', 'Essentials', 'Squeeze', 'X-Bites', 'N/A'];

  const productAttributes = [
    'AllInOne', 'Badder', 'BakedGoods', 'Balm', 'BathSalts', 'Bar', 'BodyOil', 'Budder', 'Capsules', 'Caramel', 'Cartridge',
    'Chocolate', 'Cream', 'Crumble', 'Diamonds', 'Gel', 'GroundFlower', 'Gummies', 'HardCandy', 'Hash', 'Infusion', 'Isolate',
    'Jam', 'Jelly', 'Lotion', 'Mints', 'Moonrocks', 'Oil', 'Pantry', 'Patch', 'PreRoll', 'PreRollPack', 'ReadytoDrink',
    'Resin', 'Rosin', 'Salve', 'Sauce', 'Shake', 'Shot', 'Spray', 'Sugar', 'Tablets', 'Taffy', 'Tincture', 'Troche', 'Wax',
    'WholeFlower', 'CBD', 'Cold Cured Live', 'Cured', 'Cured Dry', 'Cured Resin', 'Cured Sauce', 'Diamond Infused',
    'Diamonds & Sauce', 'Dry', 'Dry Resin', 'Extra-Strength', 'Fast-Acting', 'Fast-Acting Ratioed', 'Full Spectrum',
    'Full Spectrum Rosin', 'Gluten Free', 'Hash Infused', 'Hash Rosin', 'Hash Rosin Ratioed', 'Heat Cured', 'High Dose',
    'HTE Sauce', 'Infused', 'Liquid Concentrate', 'Liquid Diamonds', 'Liquid Sugar', 'Live', 'Live Diamonds', 'Live Hash',
    'Live Hash Rosin', 'Live Liquid Diamonds', 'Live Resin', 'Live Resin and Diamonds', 'Live Resin Diamonds',
    'Live Resin Liquid Diamonds', 'Live Resin Sauce', 'Live Rosin', 'Live Rosin Ratioed', 'Live Sauce', 'Live Terpene',
    'Macro Dose', 'Mega', 'Mega Ratioed', 'Nano', 'Nano Live Resin', 'Nano Spray', 'Ratioed', 'Ratioed RSO', 'Rosin Infused',
    'RSO', 'RSO Full Spectrum', 'Second Press', 'Single-Score XL', 'Spray Ratioed', 'THCa', 'THCa Infused', 'THCa Live',
    'Transdermal Ratioed', 'N/A'
  ];

  const dominances = ['Hybrid', 'Indica', 'Sativa', 'CBD'];
  const qtyInPacks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 100];

  // Calculate form progress
  useEffect(() => {
    const requiredFields = [
      'distributorMenuName', 'brand', 'masterCategory', 'subcategory1', 'subcategory2',
      'productLine', 'productAttribute', 'strain', 'dominance', 'cannabinoids',
      'ttlThc', 'ttlCbd', 'qtyInPack', 'itemIndexNumber'
    ];
    const filledFields = requiredFields.filter((field) => formData[field] !== '');
    const progressPercentage = (filledFields.length / requiredFields.length) * 100;
    setProgress(progressPercentage);
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.distributorMenuName || !formData.brand || !formData.masterCategory || !formData.subcategory1 ||
        !formData.subcategory2 || !formData.productLine || !formData.productAttribute || !formData.strain ||
        !formData.dominance || !formData.cannabinoids || !formData.ttlThc || !formData.ttlCbd || !formData.qtyInPack ||
        !formData.itemIndexNumber) {
      toast.error('Please fill out all required fields.');
      return;
    }

    // Validate cost
    if (formData.cost && parseFloat(formData.cost) > 50) {
      toast.error('Please enter a number less than or equal to 50 for Cost.');
      return;
    }

    // Validate item index number
    if (formData.itemIndexNumber.length > 9) {
      toast.error('Please enter at most 9 characters for Item Index Number.');
      return;
    }

    // Prepare data for storage
    const newRequest = {
      ...formData,
      id: Date.now(),
      status: 'Pending',
      completed_by: null, // Ensure completed_by is null for new requests
    };

    // Store locally using the exposed electron.store API
    try {
      const localRequests = window.electron?.store?.get('requests', []) || [];
      window.electron?.store?.set('requests', [...localRequests, newRequest]);

      // Sync with Supabase if online
      const { error } = await supabase.from('sku_requests').insert([{
        date_requested: formData.dateRequested,
        requester_email: formData.requesterEmail,
        distributor_menu_name: formData.distributorMenuName,
        brand: formData.brand,
        master_category: formData.masterCategory,
        subcategory_1: formData.subcategory1,
        subcategory_2: formData.subcategory2,
        product_line: formData.productLine,
        product_attribute: formData.productAttribute,
        strain: formData.strain,
        dominance: formData.dominance,
        flavor: formData.flavor,
        cannabinoids: formData.cannabinoids,
        ttl_thc: formData.ttlThc,
        ttl_cbd: formData.ttlCbd,
        qty_in_pack: parseInt(formData.qtyInPack),
        cost: formData.cost ? parseFloat(formData.cost) : null,
        item_index_number: formData.itemIndexNumber,
        status: 'Pending',
        completed_by: null, // Ensure completed_by is null for new requests
      }]);
      if (error) throw error;

      // Send email notification using EmailJS
      const emailParams = {
        to_email: 'recipient@example.com', // Replace with the recipient's email
        from_name: formData.requesterEmail || 'Product Creation Dashboard',
        message: `
          New SKU Request Submitted:
          Date Requested: ${formData.dateRequested}
          Distributor Menu Name: ${formData.distributorMenuName}
          Brand: ${formData.brand}
          Master Category: ${formData.masterCategory}
          Subcategory 1: ${formData.subcategory1}
          Subcategory 2: ${formData.subcategory2}
          Product Line: ${formData.productLine}
          Product Attribute: ${formData.productAttribute}
          Strain: ${formData.strain}
          Dominance: ${formData.dominance}
          Flavor: ${formData.flavor}
          Cannabinoids: ${formData.cannabinoids}
          TTL THC: ${formData.ttlThc}
          TTL CBD: ${formData.ttlCbd}
          QTY In Pack: ${formData.qtyInPack}
          Cost: ${formData.cost || 'N/A'}
          Item Index Number: ${formData.itemIndexNumber}
        `,
      };

      await emailjs.send(
        'YOUR_SERVICE_ID', // Replace with your EmailJS Service ID
        'YOUR_TEMPLATE_ID', // Replace with your EmailJS Template ID
        emailParams,
        'YOUR_USER_ID' // Replace with your EmailJS User ID
      );

      toast.success('Request submitted successfully and email sent!');
      navigate('/');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Request saved locally. Will sync and email when online.');
    }
  };

  return (
    <div className="main-content">
      <h1>🌟 Submit SKU Request 🌟</h1>
      <div className="progress-container">
        <div className="progress-bar">
          <div class="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        {/* Section 1: Basic Information */}
        <div className="form-section">
          <h2>Basic Information</h2>
          <div className="form-group">
            <label>1. Date Requested (MM/DD/YYYY) *</label>
            <input
              type="date"
              value={formData.dateRequested}
              onChange={(e) => setFormData({ ...formData, dateRequested: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>2. Requester (Email) (Leave blank for demo)</label>
            <input
              type="email"
              value={formData.requesterEmail}
              onChange={(e) => setFormData({ ...formData, requesterEmail: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>3. Distributor Menu Name * <br />Product name as it appears on Vendor menu (Biotrack)</label>
            <input
              type="text"
              value={formData.distributorMenuName}
              onChange={(e) => setFormData({ ...formData, distributorMenuName: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Section 2: Product Details */}
        <div className="form-section">
          <h2>Product Details</h2>
          <div className="form-group">
            <label>4. Brand *</label>
            <select
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              required
            >
              <option value="">Select Brand</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>5. Master Category *</label>
            <select
              value={formData.masterCategory}
              onChange={(e) => setFormData({ ...formData, masterCategory: e.target.value })}
              required
            >
              <option value="">Select Category</option>
              {masterCategories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>6. Subcategory 1 *</label>
            <select
              value={formData.subcategory1}
              onChange={(e) => setFormData({ ...formData, subcategory1: e.target.value })}
              required
            >
              <option value="">Select Subcategory</option>
              {subcategories1.map((subcategory) => (
                <option key={subcategory} value={subcategory}>{subcategory}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>7. Subcategory 2 *</label>
            <select
              value={formData.subcategory2}
              onChange={(e) => setFormData({ ...formData, subcategory2: e.target.value })}
              required
            >
              <option value="">Select Subcategory</option>
              {subcategories2.map((subcategory) => (
                <option key={subcategory} value={subcategory}>{subcategory}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>8. Product Line *</label>
            <select
              value={formData.productLine}
              onChange={(e) => setFormData({ ...formData, productLine: e.target.value })}
              required
            >
              <option value="">Select Product Line</option>
              {productLines.map((line) => (
                <option key={line} value={line}>{line}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>9. Product Attribute *</label>
            <select
              value={formData.productAttribute}
              onChange={(e) => setFormData({ ...formData, productAttribute: e.target.value })}
              required
            >
              <option value="">Select Attribute</option>
              {productAttributes.map((attribute) => (
                <option key={attribute} value={attribute}>{attribute}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>10. Strain * <br />Double check your spelling when entering names</label>
            <input
              type="text"
              value={formData.strain}
              onChange={(e) => setFormData({ ...formData, strain: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>11. Dominance *</label>
            <select
              value={formData.dominance}
              onChange={(e) => setFormData({ ...formData, dominance: e.target.value })}
              required
            >
              <option value="">Select Dominance</option>
              {dominances.map((dominance) => (
                <option key={dominance} value={dominance}>{dominance}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>12. Flavor <br />Required for Edibles, Oral, Topical & Pet products ONLY</label>
            <input
              type="text"
              value={formData.flavor}
              onChange={(e) => setFormData({ ...formData, flavor: e.target.value })}
            />
          </div>
        </div>

        {/* Section 3: Cannabinoid Information */}
        <div className="form-section">
          <h2>Cannabinoid Information</h2>
          <div className="form-group">
            <label>13. Cannabinoids * <br />List of all available cannabinoid ratios in market</label>
            <input
              type="text"
              value={formData.cannabinoids}
              onChange={(e) => setFormData({ ...formData, cannabinoids: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>14. TTL THC * <br />List of all available total THC values in market</label>
            <input
              type="text"
              value={formData.ttlThc}
              onChange={(e) => setFormData({ ...formData, ttlThc: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>15. TTL CBD * <br />List of all available total CBD values in market</label>
            <input
              type="text"
              value={formData.ttlCbd}
              onChange={(e) => setFormData({ ...formData, ttlCbd: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Section 4: Packaging and Cost */}
        <div className="form-section">
          <h2>Packaging and Cost</h2>
          <div className="form-group">
            <label>16. QTY In Pack *</label>
            <select
              value={formData.qtyInPack}
              onChange={(e) => setFormData({ ...formData, qtyInPack: e.target.value })}
              required
            >
              <option value="">Select Quantity</option>
              {qtyInPacks.map((qty) => (
                <option key={qty} value={qty}>{qty}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>17. Cost <br />If COST = $0.01, Product Creation Sheet will read as sample</label>
            <input
              type="number"
              step="0.01"
              placeholder="Please enter a number less than or equal to 50"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>18. Item Index # * <br />Please enter at most 9 characters</label>
            <input
              type="text"
              value={formData.itemIndexNumber}
              onChange={(e) => setFormData({ ...formData, itemIndexNumber: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="button" className="back-btn" onClick={() => navigate('/')}>
            Back to Main Menu
          </button>
          <button type="submit">Submit Request</button>
        </div>
      </form>
    </div>
  );
};

export default SubmitRequest;