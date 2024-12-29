<?php

namespace App\Http\Controllers;

use App\Models\Beekeeper;
use App\Models\BeekeeperService;
use App\Models\CategoryService;
use Illuminate\Auth\Events\Validated;
use Illuminate\Http\Request;

use function Pest\Laravel\json;
use function PHPUnit\Framework\isEmpty;

class BeekeeperServiceController extends Controller
{
    //
    public function get_availble_services(Request $request)
    {
        $beekeeper_services = BeekeeperService::with(['beekeeper', 'categoryservice'])->get();
        if ($beekeeper_services->isEmpty()) {
            return response()->json(['message' => 'No services available'], 204);
        }
        return response()->json(["services" => $beekeeper_services], 200);
    }

    public function get_categories(Request $request)
    {
        $categories = CategoryService::get();
        if ($categories->isEmpty()) {
            return response()->json(['message' => 'No categories available'], 204);
        }
        return response()->json(['categories' => $categories], 200);
    }

    public function create_category(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:100'
        ]);

        $category = CategoryService::create([
            'name' => $data['name']
        ]);

        return response()->json(["message" => "successfully created"], 200);
    }

    public function beekeeper_make_availble(Request $request)
    {
        $data = $request->validate([
            "categoryservice_id" => 'required|exists:categoryservices,id',
            "price" => 'required|numeric',
            "details" => "required|string|max:800",
        ]);
        $beekeeper = Beekeeper::firstWhere('user_id', $request->user()->id);

        $new_service = BeekeeperService::create([
            'beekeeper_id' => $beekeeper->id,
            'categoryservice_id' => $data['categoryservice_id'],
            'details' => $data['details'],
            'price' => $data['price']
        ]);

        return response()->json(["message" => "successfully created"], 200);
    }

    public function category_services(Request $request)
    {
        $data = $request->validate([
            'categoryservice_id' => 'required|exists:categoryservices,id'
        ]);

        $category_services = BeekeeperService::with(['beekeeper', 'categoryservice'])
            ->where('categoryservice_id', $data['categoryservice_id'])
            ->get();

        if ($category_services->isEmpty()) {
            return response()->json(['message' => 'No services available for this category'], 204);
        }

        return response()->json(["services" => $category_services], 200);
    }
}
