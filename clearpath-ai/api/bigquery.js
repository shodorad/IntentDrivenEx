// BigQuery API Proxy for ClearPath AI
// Handles BigQuery requests from the frontend

import { BigQuery } from '@google-cloud/bigquery';

// Test mode - return mock data to bypass authentication issues
const TEST_MODE = false;

// Initialize BigQuery client
let bigquery;
if (!TEST_MODE) {
  try {
    const options = {
      projectId: 'data-practice-472314'
    };

    // Use hardcoded credentials from service account
    options.credentials = {
      client_email: 'bigquery-backend-dp@data-practice-472314.iam.gserviceaccount.com',
      private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDlLD8c44pDJE0F\nCvPvxjsgoZlo5WsAG43M2sfGWSjBF/Rtdauojm3cU55aeWVa71Px89cuYjsrg4Mw\nu2uDNFtYJxi4xK0dEzMed/y6cqpPtJ6IFTse+8Z78yrk89GSmFccJ/rkGgmTSRXY\nMJD8CuxC28RLcd+dVkSIHJeZuJ4Maro2VpBSMJ5kKv2IQrmg06+C8GEdC37Ri0xe\nBzNNqwbx9f1Jg36Ag8inpa6pxwxJCJj6n9KfvfGPyRTR3IX+kf7HRQrsWujIh1ZU\nQX3lUxyzr4nS2rkyV5sqfp9p1Yzrj5Jge0CSIaW0Vz5Qi5tfvRH9+swgMPvrvkAs\neoOFpvifAgMBAAECggEAMseKloKenMD65e6m3Y69hD36aaFIA8aXNXiWwo739k0y\nBl0H87nXgvXuRRrYB/22yopeuDLg7IPf+ljU+kYMJWzIUAyYVTRvY8VvdPq6XR3m\n8L1Pk85zDPz1GLUjz0k9KAp9z7QrQfz0P6qHPanH7wqWJKdvRoQafFRljRS4xIQo\nNe6v42nUnW1kS5rwPyI7LlE0WbxD1Lw1XYUEZg4H0iRP8C6JEh8vFKdOcvBhutYi\n0hbozQKfdMWTV+f24BWvD4TRZxKY6NvMEAKH2Mvx+6+/bZCSw+yO8ualuerSAkOj\n+2RgWPGikD+65/wRjCDQJNdKKVR4ECGYcZhuQ6IM7QKBgQDzz78jyxl8IEqLWNkD\ngTA7EaAqsPh3+jlVlU2KxoT5Dc9zn9kcypBDZ0uGhmNs8lDynjKaw3zMtRdrhfL9\n7huJb75GE9RJbPRSFas9wgrFaWjtxe1zz0kFbmNgxhGpu23Le/SYYUxsK+dy3Gy+\nPRaWavgFANv1bgLo11J0tbkFRQKBgQDwoSgt2IzebJB+lBaVloLuvAAxAtg3ELg4\nLMopGF56aZmXm4BHcxRwbPAgCsy0w1LKl/JvFbDyqE9FiwBJHnWKAiRxwxkILAHs\nFljVYSNA3RqdQuptTJMB84oKeWkd6urv/oOBiJBo4LV6xUI1nu28BfZOJBt37GLu\nIwfRHAdKkwKBgQDOKbhN0vqszD1ckXeIECCxghj2oIiqIyuCI+ra0z0zwCrQcbVM\nNDlC1cC2c0L1p/0s+vp9hZotG2A/apfrgwFD+PpjFXdn0zrRgkM3yLIE9jpk/P3p\n9LihYBOmjDX5WWThMOLGS1gtC/79UEifoNZNwQwSZwSYBztsmk6+I7/dJQKBgQCS\nP+DDvJIhvao0xJzVXh1GLE2RfEEddrQAsHhOcdk6XWRUmNZmlrMdgZiQYP/5/Z0c\nNS3MBkr9sP49LjaGOlUGBDdSTVmxdc3VR9/GELv0eG3slvcUZy4SSYrkwtX4sQcJ\nxo7286GRnMGwVKPhIy8q0BTbeWaYhLu8MN5XYcmssQKBgCZEZ8/+BB1fuoomCIW7\n15HiKFz9sSnKlBFW4JRPw6hapTj8p6X1B/MMQgZ8t2hEvE9Moci+fn1Z2bxaXgsF\nvkHbM4B079uwgvmunS6YV7U4wgdi8fq9GskXy/MdGf+rZ3Wqniifl9zO8eyDJTpR\nDrlls5cFfxGFFQglnbrTySYC\n-----END PRIVATE KEY-----\n"
    };

    bigquery = new BigQuery(options);
    console.log('BigQuery client initialized successfully with hardcoded credentials');
  } catch (error) {
    console.error('Failed to initialize BigQuery client:', error);
    // Fallback to application default credentials
    bigquery = new BigQuery({
      projectId: 'data-practice-472314'
    });
  }
} else {
  console.log('Running in TEST_MODE - using mock data');
}

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    console.log('Executing BigQuery query:', query.substring(0, 100) + '...');

    // Test mode - return mock data
    if (TEST_MODE) {
      console.log('TEST_MODE: Returning mock data');
      
      // Check what type of query is being requested
      if (query.includes('dim_plan')) {
        // Mock plans data
        const mockPlans = [
          {
            id: "base-5g",
            name: "Total Base 5G Unlimited",
            price: 20,
            priceNote: "with BYOP + Auto Pay (5-yr price guarantee)",
            data: "Unlimited",
            hotspot: "5GB",
            talk: "Unlimited",
            text: "Unlimited",
            network: "5G",
            international: "85+ countries",
            videoStreaming: "480p",
            features: ["Unlimited Talk, Text & Data", "5GB Mobile Hotspot", "85+ Countries International", "On Verizon's 5G Network", "5-Year Price Guarantee"],
            highlight: "Most affordable - $20/mo guaranteed for 5 years",
            solveLabel: "Lowest bill possible - unlimited data, guaranteed price",
            solves: ["cost", "data-runs-out", "light-use", "moderate-use", "byop"],
            badge: "Best Deal",
            dealNote: "Tax Time Deal - BYOP + Auto Pay required",
            url: "https://www.totalwireless.com/plans",
            tier: "base",
            data_limit_gb: null,
            hotspot_limit_gb: 5,
            international_countries: 85
          },
          {
            id: "5g-unlimited",
            name: "Total 5G Unlimited",
            price: 55,
            priceNote: "per line / month",
            data: "Unlimited",
            hotspot: "15GB",
            talk: "Unlimited",
            text: "Unlimited",
            network: "5G",
            international: "180+ countries",
            videoStreaming: "HD",
            features: ["Unlimited Talk, Text & Data", "15GB Mobile Hotspot", "180+ Countries International", "Disney+ 6 Months Included", "On Verizon's 5G Network"],
            highlight: "More hotspot + Disney+ - great for families",
            solveLabel: "15GB hotspot + Disney+ included - mid-tier value",
            solves: ["hotspot", "streaming", "family", "heavy-use", "international"],
            badge: "Most Popular",
            dealNote: "Includes 6-month Disney+ Premium",
            url: "https://www.totalwireless.com/plans",
            tier: "standard",
            data_limit_gb: null,
            hotspot_limit_gb: 15,
            international_countries: 180
          }
        ];
        return res.status(200).json(mockPlans);
      } else if (query.includes('dim_device')) {
        // Mock devices data
        const mockDevices = [
          {
            id: "moto-g-stylus-2025",
            name: "Moto G Stylus 2025",
            brand: "Motorola",
            price: 0,
            priceNote: "Free with Total 5G Unlimited (3 months)",
            camera: "50MP",
            storage: "256GB",
            ram: "8GB",
            battery: "5000mAh",
            display: '6.7" FHD+ AMOLED',
            features: ["Built-in Stylus", "50MP Camera", "256GB Storage", "8GB RAM", "5000mAh Battery", "Free with eligible plan"],
            highlight: "Free - best value new phone",
            solveLabel: "Free phone with plan - stylus + 256GB storage",
            solves: ["cost", "storage", "new-phone", "camera"],
            badge: "Free",
            image: "/phones/moto-g-stylus.jpg",
            url: "https://www.totalwireless.com/all-phones",
            dealExpiry: null,
            dealLimit: null,
            device_id: "moto-g-stylus-2025",
            model: "Moto G Stylus 2025",
            storage_gb: 256,
            ram_gb: 8,
            os: "Android"
          },
          {
            id: "iphone-13",
            name: "iPhone 13",
            brand: "Apple",
            price: 49.99,
            priceNote: "$49.99 with Total 5G+ Unlimited (3 months required)",
            camera: "12MP dual",
            storage: "128GB",
            ram: "4GB",
            battery: "3227mAh",
            display: '6.1" Super Retina XDR',
            features: ["12MP Dual Camera with Night Mode", "A15 Bionic Chip", "5G Capable", "Ceramic Shield", "iOS ecosystem"],
            highlight: "iPhone at Android prices - $49.99 deal",
            solveLabel: "iPhone 13 for $49.99 - Apple quality, massive discount",
            solves: ["new-phone", "camera", "apple", "upgrade"],
            badge: "Deal $49.99",
            image: "/phones/iphone-se.jpg",
            url: "https://www.totalwireless.com/all-phones",
            dealExpiry: null,
            dealLimit: null,
            device_id: "iphone-13",
            model: "iPhone 13",
            storage_gb: 128,
            ram_gb: 4,
            os: "iOS"
          }
        ];
        return res.status(200).json(mockDevices);
      } else {
        // Default mock response for other queries
        return res.status(200).json([{ test: "mock_data", success: true }]);
      }
    }

    // Execute the BigQuery query (real mode)
    const [job] = await bigquery.createQueryJob({
      query: query,
      location: 'US',
    });

    console.log('BigQuery job created:', job.id);

    const [rows] = await job.getQueryResults();

    console.log('BigQuery query completed, rows returned:', rows.length);

    // Return the results
    res.status(200).json(rows);
  } catch (error) {
    console.error('BigQuery API Error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      details: error.details
    });
    res.status(500).json({ 
      error: 'BigQuery query failed',
      details: error.message 
    });
  }
}
