const Donation = require('../models/Donation');
const Contact = require('../models/Contact');
const Gallery = require('../models/Gallery');
const News = require('../models/News');
const Program = require('../models/Program');
const TeamMember = require('../models/TeamMember');
const HeroSlide = require('../models/HeroSlide');

exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalDonations, successDonations, donationAmount,
      totalContacts, newContacts,
      totalGallery, totalNews, publishedNews,
      totalPrograms, totalTeam, totalSlides,
    ] = await Promise.all([
      Donation.countDocuments(),
      Donation.countDocuments({ status: 'success' }),
      Donation.aggregate([{ $match: { status: 'success' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'new' }),
      Gallery.countDocuments(),
      News.countDocuments(),
      News.countDocuments({ isPublished: true }),
      Program.countDocuments(),
      TeamMember.countDocuments(),
      HeroSlide.countDocuments(),
    ]);

    const recentDonations = await Donation.find({ status: 'success' }).sort({ createdAt: -1 }).limit(5);
    const recentContacts = await Contact.find().sort({ createdAt: -1 }).limit(5);

    // Monthly donations (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyDonations = await Donation.aggregate([
      { $match: { status: 'success', createdAt: { $gte: sixMonthsAgo } } },
      { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.json({
      success: true,
      stats: {
        donations: { total: totalDonations, successful: successDonations, totalRaised: donationAmount[0]?.total || 0 },
        contacts: { total: totalContacts, newMessages: newContacts },
        content: { gallery: totalGallery, news: totalNews, publishedNews, programs: totalPrograms, team: totalTeam, heroSlides: totalSlides },
      },
      recentDonations,
      recentContacts,
      monthlyDonations,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getPublicStats = async (req, res) => {
  try {
    const [programs, gallery, donationResult] = await Promise.all([
      Program.countDocuments({ isActive: true }),
      Gallery.countDocuments({ isActive: true }),
      Donation.aggregate([{ $match: { status: 'success' } }, { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }]),
    ]);
    res.json({
      success: true,
      stats: {
        programs,
        gallery,
        donors: donationResult[0]?.count || 0,
        raised: donationResult[0]?.total || 0,
        communities: 12,
        volunteers: 50,
        beneficiaries: 5000,
        yearsActive: new Date().getFullYear() - 2018,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
