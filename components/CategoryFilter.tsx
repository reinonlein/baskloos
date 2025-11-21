interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const formatCategoryName = (category: string) => {
  if (category === "all") return "Alle categorieën";
  // Special case for LEGO
  if (category === "lego") return "LEGO";
  return category.charAt(0).toUpperCase() + category.slice(1);
};

export default function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="flex justify-center">
      <div className="relative">
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="appearance-none rounded-lg bg-black/50 px-6 py-3 pr-10 text-white backdrop-blur-lg transition hover:bg-black/75 focus:outline-none focus:ring-2 focus:ring-white/50"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
            backgroundPosition: "right 0.75rem center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "1.5em 1.5em",
            paddingRight: "2.5rem",
            textTransform: "capitalize",
          }}
        >
          <option value="all" className="bg-black text-white">
            Alle kunstwerken
          </option>
          {categories.map((category) => (
            <option
              key={category}
              value={category}
              className="bg-black text-white"
            >
              {formatCategoryName(category)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

