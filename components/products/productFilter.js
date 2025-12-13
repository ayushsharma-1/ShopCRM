import {useSelector, useDispatch} from 'react-redux';
import {setFilter,applyFilter, resetFilters} from '@/lib/redux/slices/productSlice';
import Button from '@/common/button';

export default function ProductFilter() {
    const dispatch = useDispatch();
    const {products ,filters} = useSelector((state) => state.products);

    const categories = ['all', ...new Set(products.map(product => product.category))];

    const handleSearchChange = (e) => {
        dispatch(setFilter({search: e.target.value}));
        applyFilter();
    }

    const handleCategoryChange = (e) => {
        dispatch(setFilter({category: e.target.value}));
        applyFilter();
    }

    const handlePriceChange = (e) => {
        const [minPrice, maxPrice] = e.target.value.split('-').map(Number);
        dispatch(setFilter({minPrice, maxPrice}));
        applyFilter();
    }

    const handleRatingChange = (e) => {
        dispatch(setFilter({minRating: Number(e.target.value)}));
        applyFilter();
    }

    const handleReset = () => {
        dispatch(resetFilters());
        applyFilter();
    }

    return (
        <div className="p-4 border rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-4">Filter Products</h3>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search..."
                    value={filters.search}
                    onChange={handleSearchChange}
                    className="w-full px-3 py-2 border rounded"
                />  
            </div>
            <div className="mb-4">
                <label className="block mb-1 font-medium">Category</label>
                <select
                    value={filters.category}
                    onChange={handleCategoryChange}
                    className="w-full px-3 py-2 border rounded"
                >
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <label className="block mb-1 font-medium">Price Range</label>   
                <select
                    value={filters.minPrice && filters.maxPrice ? `${filters.minPrice}-${filters.maxPrice}` : ''}
                    onChange={handlePriceChange}
                    className="w-full px-3 py-2 border rounded"
                >
                    <option value="">All</option>
                    <option value="0-50">$0 - $50</option>
                    <option value="51-100">$51 - $100</option>
                    <option value="101-200">$101 - $200</option>
                    <option value="201-500">$201 - $500</option>
                    <option value="501-1000">$501 - $1000</option>
                </select>
            </div>
            <div className="mb-4">
                <label className="block mb-1 font-medium">Minimum Rating</label>
                <select
                    value={filters.minRating}
                    onChange={handleRatingChange}
                    className="w-full px-3 py-2 border rounded"
                    >
                    <option value={0}>All Ratings</option>
                    <option value={1}>1 Star & Up</option>
                    <option value={2}>2 Stars & Up</option>
                    <option value={3}>3 Stars & Up</option>
                    <option value={4}>4 Stars & Up</option>
                    <option value={5}>5 Stars</option>
                    </select>
            </div>
            <Button variant="outline" onClick={handleReset}>Reset Filters</Button>
        </div>
    );
}