import { useState, useMemo } from "react";
import { Plus, Pencil, Trash2, X, Search, Filter } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getBeanOrigins,
  createBeanOrigin,
  updateBeanOrigin,
  deleteBeanOrigin,
  getCoffeeShops,
} from "../api/dataService";

function BeanOriginsPage() {
  const queryClient = useQueryClient();

  const { data: beans = [], isLoading: isLoadingBeans } = useQuery({
    queryKey: ["beanOrigins"],
    queryFn: getBeanOrigins,
  });

  const { data: coffeeShops = [] } = useQuery({
    queryKey: ["coffeeShops"],
    queryFn: getCoffeeShops,
  });

  const createMutation = useMutation({
    mutationFn: createBeanOrigin,
    onSuccess: () => {
      queryClient.invalidateQueries(["beanOrigins"]);
      toast.success("Bean Origin created!");
      closeModal();
    },
    onError: (err) => toast.error(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: updateBeanOrigin,
    onSuccess: () => {
      queryClient.invalidateQueries(["beanOrigins"]);
      toast.success("Bean Origin updated!");
      closeModal();
    },
    onError: (err) => toast.error(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBeanOrigin,
    onSuccess: () => {
      queryClient.invalidateQueries(["beanOrigins"]);
      toast.success("Bean Origin deleted!");
    },
    onError: (err) => toast.error(err.message),
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBean, setEditingBean] = useState(null);
  const [formData, setFormData] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [processFilter, setProcessFilter] = useState("all");
  const [roastFilter, setRoastFilter] = useState("all");

  const filteredBeans = useMemo(() => {
    return beans.filter((bean) => {
      const matchesSearch =
        bean.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bean.roaster.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bean.originRegion?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        false;
      const matchesProcess = processFilter === "all" || bean.process === processFilter;
      const matchesRoast = roastFilter === "all" || bean.roastLevel === roastFilter;
      return matchesSearch && matchesProcess && matchesRoast;
    });
  }, [beans, searchQuery, processFilter, roastFilter]);

  const handleEdit = (bean) => {
    setEditingBean(bean);
    const formValues = {
      ...bean,
      coffeeShopId: typeof bean.coffeeShopId === "object" ? bean.coffeeShopId?._id : bean.coffeeShopId,
    };
    setFormData(formValues);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this bean origin?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const dataToSubmit = {
      ...formData,
      altitude: formData.altitude ? Number(formData.altitude) : undefined,
      priceCup: formData.priceCup ? Number(formData.priceCup) : undefined,
    };

    if (editingBean) {
      updateMutation.mutate({ id: editingBean._id, data: dataToSubmit });
    } else {
      createMutation.mutate(dataToSubmit);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBean(null);
    setFormData({});
  };

  const getCoffeeShopName = (shopData) => {
    if (shopData && typeof shopData === "object" && shopData.name) {
      return shopData.name;
    }
    const found = coffeeShops.find((s) => s._id === shopData);
    return found ? found.name : "Unknown";
  };

  if (isLoadingBeans) {
    return <div className="p-8 text-center">Loading bean origins...</div>;
  }

  return (
    <div className="max-w-[1600px] mx-auto px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-gray-900 mb-1">Bean Origins</h2>
          <p className="text-gray-600">Manage your coffee bean origins and varieties</p>
        </div>
        <button
          onClick={() => {
            setEditingBean(null);
            setFormData({});
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          <Plus className="size-5" />
          Add Bean Origin
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200/60 p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, roaster, or region..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900/20 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="size-5 text-gray-400" />
            <select
              value={processFilter}
              onChange={(e) => setProcessFilter(e.target.value)}
              className="px-3 py-2.5 bg-gray-50 border border-gray-200/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900/20 transition-all"
            >
              <option value="all">All Processes</option>
              <option value="Washed">Washed</option>
              <option value="Natural">Natural</option>
              <option value="Honey">Honey</option>
              <option value="Anaerobic">Anaerobic</option>
              <option value="Experimental">Experimental</option>
            </select>

            <select
              value={roastFilter}
              onChange={(e) => setRoastFilter(e.target.value)}
              className="px-3 py-2.5 bg-gray-50 border border-gray-200/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900/20 transition-all"
            >
              <option value="all">All Roasts</option>
              <option value="Light">Light</option>
              <option value="Medium">Medium</option>
              <option value="Dark">Dark</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200/60 bg-gray-50/50">
                <th className="px-6 py-3 text-left text-gray-700">Name</th>
                <th className="px-6 py-3 text-left text-gray-700">Roaster</th>
                <th className="px-6 py-3 text-left text-gray-700">Origin Region</th>
                <th className="px-6 py-3 text-left text-gray-700">Process</th>
                <th className="px-6 py-3 text-left text-gray-700">Roast Level</th>
                <th className="px-6 py-3 text-left text-gray-700">Altitude</th>
                <th className="px-6 py-3 text-left text-gray-700">Price/Cup</th>
                <th className="px-6 py-3 text-left text-gray-700">Coffee Shop</th>
                <th className="px-6 py-3 text-left text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBeans.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-8 text-gray-500">
                    No beans found.
                  </td>
                </tr>
              ) : (
                filteredBeans.map((bean) => (
                  <tr key={bean._id} className="border-b border-gray-200/60 hover:bg-gray-50/30 transition-colors">
                    <td className="px-6 py-4 text-gray-900">{bean.name}</td>
                    <td className="px-6 py-4 text-gray-600">{bean.roaster}</td>
                    <td className="px-6 py-4 text-gray-600">{bean.originRegion || "—"}</td>
                    <td className="px-6 py-4">
                      {bean.process && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-50 text-blue-700">
                          {bean.process}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {bean.roastLevel && (
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-md ${
                            bean.roastLevel === "Light"
                              ? "bg-amber-50 text-amber-700"
                              : bean.roastLevel === "Medium"
                                ? "bg-orange-50 text-orange-700"
                                : "bg-gray-800 text-white"
                          }`}
                        >
                          {bean.roastLevel}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{bean.altitude ? `${bean.altitude}m` : "—"}</td>
                    <td className="px-6 py-4 text-gray-600">{bean.priceCup ? `$${bean.priceCup.toFixed(2)}` : "—"}</td>
                    <td className="px-6 py-4 text-gray-600">{getCoffeeShopName(bean.coffeeShopId)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(bean)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil className="size-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(bean._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200/60 px-6 py-4 flex items-center justify-between">
              <h3 className="text-gray-900">{editingBean ? "Edit Bean Origin" : "Add Bean Origin"}</h3>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="size-5 text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Roaster *</label>
                <input
                  type="text"
                  required
                  value={formData.roaster || ""}
                  onChange={(e) => setFormData({ ...formData, roaster: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900/20 transition-all"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Origin Region</label>
                <input
                  type="text"
                  value={formData.originRegion || ""}
                  onChange={(e) => setFormData({ ...formData, originRegion: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900/20 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Process</label>
                  <select
                    value={formData.process || ""}
                    onChange={(e) => setFormData({ ...formData, process: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900/20 transition-all"
                  >
                    <option value="">Select process</option>
                    <option value="Washed">Washed</option>
                    <option value="Natural">Natural</option>
                    <option value="Honey">Honey</option>
                    <option value="Anaerobic">Anaerobic</option>
                    <option value="Experimental">Experimental</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Roast Level</label>
                  <select
                    value={formData.roastLevel || ""}
                    onChange={(e) => setFormData({ ...formData, roastLevel: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900/20 transition-all"
                  >
                    <option value="">Select roast level</option>
                    <option value="Light">Light</option>
                    <option value="Medium">Medium</option>
                    <option value="Dark">Dark</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Altitude (meters)</label>
                  <input
                    type="number"
                    value={formData.altitude || ""}
                    onChange={(e) => setFormData({ ...formData, altitude: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Price per Cup ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.priceCup || ""}
                    onChange={(e) => setFormData({ ...formData, priceCup: e.target.value })}
                    className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Coffee Shop *</label>
                <select
                  required
                  value={formData.coffeeShopId || ""}
                  onChange={(e) => setFormData({ ...formData, coffeeShopId: e.target.value })}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900/20 transition-all"
                >
                  <option value="">Select coffee shop</option>
                  {coffeeShops.map((shop) => (
                    <option key={shop._id} value={shop._id}>
                      {shop.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-gray-200/60">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 border border-gray-200/60 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? "Saving..."
                    : editingBean
                      ? "Update"
                      : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BeanOriginsPage;
