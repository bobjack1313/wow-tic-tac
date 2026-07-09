from rules import is_legal_boss_offer


def test_opening_must_be_connected():
    assert is_legal_boss_offer(set(), {4, 6, 2})
    assert not is_legal_boss_offer(set(), {1, 3, 7})


def test_owned_square_allows_connected_growth():
    assert not is_legal_boss_offer({8}, {1, 2, 3})
    assert is_legal_boss_offer({8}, {2, 5, 6})
    assert is_legal_boss_offer({8}, {2, 6, 9})


def test_offer_cannot_include_occupied_square():
    assert not is_legal_boss_offer({8}, {8, 5, 6})
