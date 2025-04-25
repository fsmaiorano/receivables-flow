import dataSource from './data-source';

/**
 * Runs database migrations
 */
async function runMigrations() {
  try {
    // Initialize the data source
    const initialized = await dataSource.initialize();
    console.log('Data source has been initialized');

    // Run migrations
    console.log('Running migrations...');
    const migrations = await initialized.runMigrations();

    if (migrations.length === 0) {
      console.log('No migrations to run');
    } else {
      console.log(`Executed ${migrations.length} migrations`);
    }

    // Close the connection
    await initialized.destroy();
    console.log('Data source has been closed');

    return true;
  } catch (error) {
    console.error('Error during migration run:', error);
    return false;
  }
}

// Run the function if this file is executed directly
if (require.main === module) {
  runMigrations()
    .then((success) => {
      if (!success) {
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('Unhandled error during migrations:', error);
      process.exit(1);
    });
}

export default runMigrations;
