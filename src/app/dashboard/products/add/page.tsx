import AddProductForm from "@/components/forms/products/add-product-form";
import Nav from "@/components/nav/nav";

const AddProduct = () => {
  return (
    <Nav>
      <div className="flex items-center justify-between">
        <h1 className="my-5 text-xl text-zinc-400">Add Product</h1>
      </div>
      <AddProductForm />
    </Nav>
  );
};

export default AddProduct;
